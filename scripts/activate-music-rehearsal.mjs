// Trusted first-release bootstrap, authorized for Relica's only. Never queue edits.
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';
try {
  const config=parseEnv(readFileSync('.env.production.local','utf8'));
  const url=new URL(config.DATABASE_URL),ref=new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
  if(!url.hostname.includes(ref) && !decodeURIComponent(url.username).includes(ref)) throw Error('Target mismatch');
  const env={...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGUSER:decodeURIComponent(url.username),
    PGPASSWORD:decodeURIComponent(url.password),PGDATABASE:url.pathname.slice(1)||'postgres',PGSSLMODE:'require',
    PGCONNECT_TIMEOUT:'10',PGOPTIONS:'-c statement_timeout=15000 -c lock_timeout=5000'};
  const change=process.argv.includes('--apply') ? `
    do $$ declare tenant uuid; begin
      if current_user<>'postgres' then raise exception 'Trusted operator required'; end if;
      select id into strict tenant from public.establishments where slug='relicas' and active for update;
      if (select count(*) from supabase_migrations.schema_migrations where version between '20260930000002' and '20260930000006')<>5
        then raise exception 'Compatible migrations required'; end if;
      if exists(select 1 from public.music_settings where establishment_id<>tenant and music_enabled)
        then raise exception 'Other tenant already enabled: review required'; end if;
      update private.music_quota set daily_budget=case bucket when 'search' then 80 when 'video' then 100 end
        where bucket in ('search','video');
      if (select count(*) from private.music_quota where bucket in ('search','video'))<>2 then raise exception 'Quota missing'; end if;
      insert into public.music_settings(establishment_id,music_enabled,requests_enabled)
        values(tenant,true,true) on conflict(establishment_id) do update
          set music_enabled=true,requests_enabled=true,updated_at=clock_timestamp();
    end $$;` : '';
  const sql=`begin ${change?'':'read only'}; ${change}
    select json_build_object('slug',e.slug,'enabled',s.music_enabled,'requestsEnabled',s.requests_enabled,
      'searchBudget',(select daily_budget from private.music_quota where bucket='search'),
      'videoBudget',(select daily_budget from private.music_quota where bucket='video'))
      from public.establishments e left join public.music_settings s on s.establishment_id=e.id where e.slug='relicas'; commit;`;
  const r=spawnSync('C:/Program Files/PostgreSQL/18/bin/psql.exe',['-X','-w','-q','-At','-v','ON_ERROR_STOP=1'],
    {env,input:sql,encoding:'utf8',timeout:30000});
  if(r.status!==0) throw Error('Activation failed');
  console.log(r.stdout.trim());
} catch {console.error('Rehearsal configuration failed; sensitive diagnostics withheld. Verify state before retrying.');process.exitCode=1;}
