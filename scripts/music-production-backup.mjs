// Authorized read-only production backup + isolated restore rehearsal.
// Never print credentials, database rows or raw utility diagnostics.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:net';

const bin = process.env.PG_BIN || 'C:/Program Files/PostgreSQL/18/bin';
const executable = name => join(bin, `${name}.exe`);
function run(name, args, options = {}) {
  const result = spawnSync(executable(name), args, {timeout:120000,maxBuffer:64*1024*1024,...options});
  if (result.status !== 0) throw Error(`${name} failed; sensitive diagnostics withheld`);
  return result.stdout;
}
function protect(buffer, unprotect = false) {
  const action = unprotect ? 'Unprotect' : 'Protect';
  const result = spawnSync('powershell.exe', ['-NoProfile','-NonInteractive','-Command',
    `Add-Type -AssemblyName System.Security; $bytes=[Convert]::FromBase64String([Console]::In.ReadToEnd()); $protected=[Security.Cryptography.ProtectedData]::${action}($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); [Console]::Out.Write([Convert]::ToBase64String($protected));`],
    {input:buffer.toString('base64'),encoding:'utf8',timeout:30000,maxBuffer:128*1024*1024});
  if (result.status !== 0) throw Error('Windows user-bound backup protection failed');
  return Buffer.from(result.stdout,'base64');
}
const sqlArgs = ['-X','-w','-q','-At','-v','ON_ERROR_STOP=1'];
let localEnv, directory, started = false, stage = 'target verification';
try {
  if (process.platform !== 'win32') throw Error('This backup protection requires Windows');
  const config = parseEnv(readFileSync('.env.production.local','utf8'));
  const connection = new URL(config.DATABASE_URL);
  const project = new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
  if (!connection.hostname.includes(project) && !decodeURIComponent(connection.username).includes(project))
    throw Error('Production target mismatch');
  const remoteEnv = {...process.env,PGHOST:connection.hostname,PGPORT:connection.port||'5432',
    PGUSER:decodeURIComponent(connection.username),PGPASSWORD:decodeURIComponent(connection.password),
    PGDATABASE:connection.pathname.slice(1)||'postgres',PGSSLMODE:'require',PGCONNECT_TIMEOUT:'10',
    PGAPPNAME:'qrcodex-task058-backup',PGOPTIONS:'-c statement_timeout=120000 -c lock_timeout=5000'};
  const restoreIndex = process.argv.indexOf('--restore-backup');
  const restorePath = restoreIndex < 0 ? null : resolve(process.argv[restoreIndex+1] || '');
  if (restorePath && (dirname(restorePath)!==resolve('.release-backups') || !basename(restorePath).endsWith('.dump.dpapi')))
    throw Error('Backup target outside approved directory');
  stage = 'encrypted archive creation/verification';
  const archive = restorePath ? protect(readFileSync(restorePath),true) :
    run('pg_dump',['-w','--format=custom','--schema=public','--schema=private',
      '--schema=supabase_migrations'],{env:remoteEnv});
  if (!archive.subarray(0,5).equals(Buffer.from('PGDMP'))) throw Error('Invalid backup archive');
  const encrypted = protect(archive);
  const digest = createHash('sha256').update(archive).digest('hex');
  if (createHash('sha256').update(protect(encrypted,true)).digest('hex') !== digest)
    throw Error('Backup encryption roundtrip failed');
  mkdirSync('.release-backups',{recursive:true});
  const stem = restorePath ? restorePath.slice(0,-'.dump.dpapi'.length) :
    `.release-backups/music-${new Date().toISOString().replaceAll(':','-')}`;
  if (!restorePath) writeFileSync(`${stem}.dump.dpapi`,encrypted,{flag:'wx'});
  run('pg_restore',['--list'],{input:archive});

  // Provider schemas are mocked only for the local rehearsal. Auth credentials,
  // sessions and Storage object files are deliberately outside this backup scope.
  directory = mkdtempSync(join(tmpdir(),'qrcodex-music-restore-'));
  stage = 'isolated database initialization';
  const server = createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port = server.address().port;
  await new Promise(resolve=>server.close(resolve));
  localEnv = {...process.env,PGHOST:'127.0.0.1',PGPORT:String(port),PGUSER:'postgres',PGDATABASE:'postgres',
    PGPASSWORD:'',PGSSLMODE:'disable',PGCONNECT_TIMEOUT:'5',PGOPTIONS:'-c statement_timeout=60000'};
  run('initdb',['-D',directory,'--auth=trust','--username=postgres','--encoding=UTF8','--no-locale']);
  run('pg_ctl',['-D',directory,'-l',join(directory,'server.log'),'-o',`-p ${port} -h 127.0.0.1`,'-w','start'],
    {env:localEnv,timeout:30000,stdio:['ignore','ignore','pipe']});
  started = true;
  stage = 'provider mock initialization';
  const sql = value => run('psql',sqlArgs,{env:localEnv,input:value}).toString().trim();
  sql(`drop schema public; create role anon; create role authenticated; create role service_role bypassrls;
    create role supabase_admin; create role dashboard_user;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid';
    create schema realtime; create function realtime.send(jsonb,text,text,boolean default true)
      returns void language sql as 'select';`);
  const members = run('pg_restore',['--data-only','--table=establishment_users','--file=-'],{input:archive}).toString();
  const ids = [...new Set(members.match(/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/gi)||[])];
  if (ids.length) sql(`insert into auth.users(id) values ${ids.map(id=>`('${id}')`).join(',')};`);
  stage = 'isolated archive restore';
  run('pg_restore',['--dbname=postgres','--no-owner','--exit-on-error'],{env:localEnv,input:archive});
  stage = 'restored invariant verification';
  const restored = JSON.parse(sql(`select json_build_object('queueRows',(select count(*) from public.music_requests),
    'multiplePlayingTenants',(select count(*) from (select establishment_id from public.music_requests
      where status='playing' group by establishment_id having count(*)>1) bad),
    'musicVersions',(select json_agg(version order by version) from supabase_migrations.schema_migrations
      where version like '20260930%'));`));
  if (restored.multiplePlayingTenants !== 0) throw Error('Restored playback invariant failed');
  writeFileSync(`${stem}.json`,JSON.stringify({createdAt:new Date().toISOString(),
    scope:['public','private','supabase_migrations'],excludes:['Auth credentials/sessions','Storage object files'],
    encryption:'Windows DPAPI CurrentUser; requires this Windows user/profile for recovery',
    archiveSha256:digest,restoreRehearsal:'PASS; isolated PostgreSQL, provider schemas mocked',...restored},null,2),{flag:'wx'});
  console.log(JSON.stringify({backup:`${stem}.dump.dpapi`,encrypted:true,restoreRehearsal:'PASS',...restored}));
} catch {
  console.error(`Backup/restore checkpoint failed at ${stage}; no production writes. Sensitive diagnostics withheld.`);
  process.exitCode=1;
} finally {
  if (started) {
    try {
      run('pg_ctl',['-D',directory,'-m','fast','-w','stop'],{env:localEnv,timeout:30000,stdio:['ignore','ignore','pipe']});
      // Delete only the generated, stopped rehearsal cluster, never the backup.
      const target = resolve(directory);
      if (dirname(target)!==resolve(tmpdir()) || !basename(target).startsWith('qrcodex-music-restore-'))
        throw Error('Unexpected rehearsal directory');
      rmSync(target,{recursive:true});
    } catch {
      console.error('Isolated restore server requires local shutdown.'); process.exitCode=1;
    }
  }
}
