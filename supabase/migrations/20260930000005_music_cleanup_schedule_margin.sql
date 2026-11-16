-- Hourly cleanup gets a conservative margin below the 30-day/24-hour caps.
-- TASK-058 must verify a supported cron plan and monitor execution before release.
alter table private.music_limit_config add constraint music_limit_retention_window
  check (window_size<=interval '23 hours');

create or replace function public.music_cleanup() returns jsonb
language plpgsql security definer set search_path='' as $$
declare tenant uuid; removed integer:=0; n integer;
begin
  for tenant in select id from public.establishments order by id loop
    perform 1 from public.establishments where id=tenant for update;
    if exists(select 1 from public.music_requests where establishment_id=tenant and status in ('queued','playing')
      and metadata_verified_at<=clock_timestamp()-interval '29 days') then
      update private.music_leases set current_request_id=null,playback_generation=playback_generation+1
        where establishment_id=tenant and current_request_id in (select id from public.music_requests
          where establishment_id=tenant and metadata_verified_at<=clock_timestamp()-interval '29 days');
      perform private.music_instruction(tenant);
    end if;
    delete from public.music_requests where establishment_id=tenant and metadata_verified_at<=clock_timestamp()-interval '29 days';
    get diagnostics n=row_count; removed:=removed+n;
    delete from private.music_receipts where establishment_id=tenant and created_at<=clock_timestamp()-interval '29 days';
    delete from private.music_pairings where establishment_id=tenant and (expires_at<=clock_timestamp() or consumed_at is not null);
    update private.music_leases set token_hash=null,instance_id=null,boot_id=null,ready=false,expires_at='-infinity',
      lease_generation=lease_generation+1,playback_generation=playback_generation+1
      where establishment_id=tenant and token_hash in (select token_hash from private.music_devices
        where establishment_id=tenant and (expires_at<=clock_timestamp() or revoked_at is not null));
    delete from private.music_devices where establishment_id=tenant and (expires_at<=clock_timestamp() or revoked_at is not null);
  end loop;
  perform private.music_rate_lock();
  delete from private.music_rate_events where occurred_at<=clock_timestamp()-interval '23 hours';
  return jsonb_build_object('removedRequests',removed);
end $$;
