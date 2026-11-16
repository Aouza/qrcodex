-- Trusted deployment operation, after compatible app/migrations and backup checks.
-- Enable pg_cron through Supabase's Cron integration before running this file.
-- Do not grant cron access to application roles or remove unrelated jobs.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
do $$
begin
  if current_user <> 'postgres' then
    raise exception 'Music scheduler requires the trusted postgres operator';
  end if;
  if to_regprocedure('cron.schedule(text,text,text)') is null then
    raise exception 'Enable Supabase Cron before configuring Music cleanup';
  end if;
  if to_regprocedure('public.music_cleanup()') is null then
    raise exception 'Apply compatible Music migrations before scheduling cleanup';
  end if;
  if exists (select 1 from cron.job where jobname = 'relicas-music-cleanup-hourly'
    and (username <> current_user or database <> current_database())) then
    raise exception 'Music cleanup job ownership/target conflict';
  end if;
  if (select count(*) from cron.job where jobname = 'relicas-music-cleanup-hourly') > 1 then
    raise exception 'Duplicate Music cleanup jobs require operator review';
  end if;
  perform cron.schedule('relicas-music-cleanup-hourly', '0 * * * *',
    'set statement_timeout = ''5min''; set lock_timeout = ''5s''; select public.music_cleanup();');
  if not exists (select 1 from cron.job where jobname = 'relicas-music-cleanup-hourly'
    and active and schedule = '0 * * * *' and username = current_user
    and database = current_database()) then
    raise exception 'Music cleanup scheduler verification failed';
  end if;
end $$;
commit;
