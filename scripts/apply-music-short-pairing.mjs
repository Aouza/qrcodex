// Applies only the user-authorized short-code function replacement, atomically.
import {readFileSync,existsSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
const version='20260930000007',name='music_short_pairing';
const quote=value=>`'${value.replaceAll("'","''")}'`;
try {
 const config=parseEnv(readFileSync('.env.production.local','utf8'));
 const connection=new URL(config.DATABASE_URL),ref=new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
 if(!connection.hostname.includes(ref)&&!decodeURIComponent(connection.username).includes(ref))throw Error('Target mismatch');
 const env={...process.env,PGHOST:connection.hostname,PGPORT:connection.port||'5432',
  PGUSER:decodeURIComponent(connection.username),PGPASSWORD:decodeURIComponent(connection.password),
  PGDATABASE:connection.pathname.slice(1)||'postgres',PGSSLMODE:'require',PGCONNECT_TIMEOUT:'10',
  PGAPPNAME:'qrcodex-short-pairing',PGOPTIONS:'-c statement_timeout=30000 -c lock_timeout=5000'};
 const query=sql=>{
  const result=spawnSync('C:/Program Files/PostgreSQL/18/bin/psql.exe',
   ['-X','-w','-q','-At','-v','ON_ERROR_STOP=1'],{env,input:sql,encoding:'utf8',timeout:40000});
  if(result.status!==0)throw Error('Database check/transaction failed; diagnostics withheld');
  return result.stdout.trim();
 };
 if(!process.argv.includes('--apply')){
  console.log(query(`select json_build_object('shortPairingApplied',exists(select 1 from supabase_migrations.schema_migrations where version=${quote(version)}));`));
 }else{
  const index=process.argv.indexOf('--backup-manifest'),path=resolve(process.argv[index+1]||'');
  if(index<0||dirname(path)!==resolve('.release-backups')||!path.endsWith('.json'))throw Error('Backup required');
  const backup=JSON.parse(readFileSync(path,'utf8'));
  if(!backup.restoreRehearsal?.startsWith('PASS')||!existsSync(path.slice(0,-5)+'.dump.dpapi'))throw Error('Verified backup required');
  const sql=readFileSync(`supabase/migrations/${version}_${name}.sql`,'utf8');
  query(`begin;
   select pg_advisory_xact_lock(hashtext('qrcodex-short-pairing-migration'));
   do $$ begin
    if (select count(*) from supabase_migrations.schema_migrations where version between '20260930000000' and '20260930000006')<>7
     or exists(select 1 from supabase_migrations.schema_migrations where version=${quote(version)}) then
     raise exception 'Unexpected migration history'; end if;
   end $$;
   lock table public.music_requests,private.music_devices,private.music_leases in share mode;
   create temp table pairing_before on commit drop as select
    (select md5(coalesce(jsonb_agg(to_jsonb(r) order by id)::text,'')) from public.music_requests r) requests,
    (select md5(coalesce(jsonb_agg(to_jsonb(d) order by token_hash)::text,'')) from private.music_devices d) devices,
    (select md5(coalesce(jsonb_agg(to_jsonb(l) order by establishment_id)::text,'')) from private.music_leases l) leases;
   ${sql}
   do $$ begin
    if not has_function_privilege('authenticated','public.music_admin_pair(uuid,boolean)','execute')
     or has_function_privilege('anon','public.music_admin_pair(uuid,boolean)','execute')
     or has_function_privilege('service_role','public.music_admin_pair(uuid,boolean)','execute') then raise exception 'Unexpected grants'; end if;
    if exists(select 1 from pairing_before where
     requests is distinct from (select md5(coalesce(jsonb_agg(to_jsonb(r) order by id)::text,'')) from public.music_requests r)
     or devices is distinct from (select md5(coalesce(jsonb_agg(to_jsonb(d) order by token_hash)::text,'')) from private.music_devices d)
     or leases is distinct from (select md5(coalesce(jsonb_agg(to_jsonb(l) order by establishment_id)::text,'')) from private.music_leases l)) then
     raise exception 'Playback data changed'; end if;
   end $$;
   insert into supabase_migrations.schema_migrations(version,name,statements) values(${quote(version)},${quote(name)},array[${quote(sql)}]);
   notify pgrst,'reload schema';
   commit;`);
  console.log('Short pairing migration PASS: issuance replaced; grants, queue, devices and leases preserved. No code issued.');
 }
}catch{console.error('Short pairing migration failed or state uncertain; details withheld. Check migration status before retrying.');process.exitCode=1;}
