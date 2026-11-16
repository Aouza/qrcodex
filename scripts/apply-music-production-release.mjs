// Authorized TASK-058 rollout only: verified backup + READY protected Preview,
// five precise migrations and approved Supabase Cron. No quota/module activation.
import {readFileSync,existsSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';
import {join,resolve,dirname} from 'node:path';
const files=[
  ['20260930000002','music_production_schema'],['20260930000003','music_production_rpcs'],
  ['20260930000004','music_production_admission'],['20260930000005','music_cleanup_schedule_margin'],
  ['20260930000006','music_admin_snapshot'],
];
const quote=value=>`'${value.replaceAll("'","''")}'`;
let writeAttempted=false;
try {
  const config=parseEnv(readFileSync('.env.production.local','utf8'));
  const connection=new URL(config.DATABASE_URL);
  const ref=new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
  if(!connection.hostname.includes(ref) && !decodeURIComponent(connection.username).includes(ref))
    throw Error('Production database target mismatch');
  const env={...process.env,PGHOST:connection.hostname,PGPORT:connection.port||'5432',
    PGUSER:decodeURIComponent(connection.username),PGPASSWORD:decodeURIComponent(connection.password),
    PGDATABASE:connection.pathname.slice(1)||'postgres',PGSSLMODE:'require',PGCONNECT_TIMEOUT:'10',
    PGAPPNAME:'qrcodex-task058-rollout',PGOPTIONS:'-c statement_timeout=60000 -c lock_timeout=5000'};
  const query=sql=>{
    const result=spawnSync('C:/Program Files/PostgreSQL/18/bin/psql.exe',
      ['-X','-w','-q','-At','-v','ON_ERROR_STOP=1'],{env,input:sql,encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
    if(result.status!==0) throw Error('Database operation failed; sensitive diagnostics withheld');
    return result.stdout.trim();
  };
  const versions=JSON.parse(query(`begin read only; select coalesce(json_agg(version order by version),'[]'::json)
    from supabase_migrations.schema_migrations where version like '20260930%'; commit;`));
  if(!process.argv.includes('--apply')) {console.log(JSON.stringify({mode:'read-only',versions,pending:files.filter(([v])=>!versions.includes(v)).map(([v])=>v)}));}
  else {
    const preview=process.argv[process.argv.indexOf('--preview-id')+1];
    const backupPath=resolve(process.argv[process.argv.indexOf('--backup-manifest')+1]||'');
    if(!/^dpl_[A-Za-z0-9]+$/.test(preview||'') || dirname(backupPath)!==resolve('.release-backups') || !backupPath.endsWith('.json'))
      throw Error('Verified Preview/backup arguments required');
    const backup=JSON.parse(readFileSync(backupPath,'utf8'));
    if(!backup.restoreRehearsal?.startsWith('PASS') || !existsSync(backupPath.slice(0,-5)+'.dump.dpapi') ||
      Date.now()-Date.parse(backup.createdAt)>24*60*60*1000) throw Error('Fresh verified encrypted backup required');
    const project=JSON.parse(readFileSync('.vercel/project.json','utf8'));
    const auth=JSON.parse(readFileSync(join(process.env.APPDATA,'com.vercel.cli/Data/auth.json'),'utf8'));
    const api=async path=>{
      const response=await fetch(`https://api.vercel.com${path}?teamId=${project.orgId}`,
        {headers:{Authorization:`Bearer ${auth.token}`},signal:AbortSignal.timeout(15000)});
      if(!response.ok) throw Error('Protected Preview verification unavailable');
      return response.json();
    };
    const [deployment,settings]=await Promise.all([api(`/v13/deployments/${preview}`),api(`/v9/projects/${project.projectId}`)]);
    if(deployment.projectId!==project.projectId || deployment.readyState!=='READY' || deployment.target==='production' ||
      !['all_except_custom_domains','all'].includes(settings.ssoProtection?.deploymentType) ||
      ![deployment.meta?.githubCommitRef,deployment.meta?.gitCommitRef].includes('feat/music-production'))
      throw Error('Compatible READY protected feature Preview required');
    if(versions.length===7 && files.every(([v])=>versions.includes(v))) {
      console.log(JSON.stringify({alreadyApplied:true,versions}));
    } else {
      if(JSON.stringify(versions)!==JSON.stringify(['20260930000000','20260930000001']))
        throw Error('Unexpected/partial Music migration history; operator review required');
      const migrations=files.map(([version,name])=>{
        const sql=readFileSync(`supabase/migrations/${version}_${name}.sql`,'utf8');
        return `${sql}\ninsert into supabase_migrations.schema_migrations(version,name,statements)
          values(${quote(version)},${quote(name)},ARRAY[${quote(sql)}]);`;
      }).join('\n');
      const cron=readFileSync('supabase/operations/music-cleanup-cron.sql','utf8')
        .replace(/^begin;\s*$/m,'').replace(/^commit;\s*$/m,'');
      writeAttempted=true;
      query(`begin; select pg_advisory_xact_lock(hashtext('qrcodex-task058-rollout'));
        lock table public.music_requests in share row exclusive mode;
        do $$ begin
          if to_regclass('public.music_settings') is not null or
            (select count(*) from supabase_migrations.schema_migrations where version like '20260930%')<>2 then
            raise exception 'Concurrent/partial migration state'; end if;
        end $$;
        create temporary table task058_queue_before on commit drop as
          select id,establishment_id,status,requested_at,playing_at,played_at,failed_at from public.music_requests;
        ${migrations}
        create extension if not exists pg_cron with schema pg_catalog;
        ${cron}
        do $$ begin
          if exists ((select * from task058_queue_before except
            select id,establishment_id,status,requested_at,playing_at,played_at,failed_at from public.music_requests)
            union all (select id,establishment_id,status,requested_at,playing_at,played_at,failed_at from public.music_requests
              except select * from task058_queue_before)) then raise exception 'Queue/history changed'; end if;
          if exists(select 1 from public.music_settings where music_enabled or requests_enabled) then
            raise exception 'Music must remain OFF'; end if;
          if has_schema_privilege('anon','cron','usage') or has_schema_privilege('authenticated','cron','usage') or
            has_schema_privilege('service_role','cron','usage') then raise exception 'Unexpected application cron privilege'; end if;
        end $$;
        notify pgrst,'reload schema'; commit;`);
      console.log(JSON.stringify({migrationsApplied:files.map(([v])=>v),scheduler:'hourly Supabase Cron',
        queueHistoryPreserved:true,moduleEnabled:false,quotaConfigured:false}));
    }
  }
} catch(error) {
  console.error(error instanceof Error && /^(Production|Database|Verified|Fresh|Protected|Compatible|Unexpected)/.test(error.message)
    ? error.message : 'Rollout unavailable; sensitive diagnostics withheld');
  if(writeAttempted) console.error('Verify remote state before retrying; transaction is atomic but connection acknowledgement can be interrupted.');
  process.exitCode=1;
}
