// Trusted operational verification of the approved job. Temporary minute cadence
// exercises the real worker, then restores hourly even on verification failure.
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
const config=parseEnv(readFileSync('.env.production.local','utf8'));
const connection=new URL(config.DATABASE_URL);
const ref=new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
if(!connection.hostname.includes(ref) && !decodeURIComponent(connection.username).includes(ref))
  throw Error('Production target mismatch');
const env={...process.env,PGHOST:connection.hostname,PGPORT:connection.port||'5432',
  PGUSER:decodeURIComponent(connection.username),PGPASSWORD:decodeURIComponent(connection.password),
  PGDATABASE:connection.pathname.slice(1)||'postgres',PGSSLMODE:'require',PGCONNECT_TIMEOUT:'10',
  PGAPPNAME:'qrcodex-task058-cron-check',PGOPTIONS:'-c statement_timeout=15000 -c lock_timeout=5000'};
function query(sql) {
  const r=spawnSync('C:/Program Files/PostgreSQL/18/bin/psql.exe',
    ['-X','-w','-q','-At','-v','ON_ERROR_STOP=1'],{env,input:sql,encoding:'utf8',timeout:30000});
  if(r.status!==0) throw Error('Cron verification unavailable; diagnostics withheld');
  return r.stdout.trim();
}
const name='relicas-music-cleanup-hourly';
let altered=false;
try {
  const baseline=JSON.parse(query(`begin read only; select json_build_object('jobs',count(*),
    'id',min(jobid),'hourly',bool_and(schedule='0 * * * *' and active and username=current_user
      and database=current_database())) from cron.job where jobname='${name}'; commit;`));
  if(baseline.jobs!==1 || !baseline.hourly) throw Error('Unexpected cleanup scheduler state');
  if(!process.argv.includes('--exercise')) console.log(JSON.stringify(baseline));
  else {
    const since=query('select clock_timestamp();');
    altered=true;
    query(`begin; select cron.alter_job(${baseline.id},schedule:='* * * * *'); commit;`);
    console.log('Cron verification: waiting for one real worker run; hourly cadence restored afterwards.');
    let result;
    const deadline=Date.now()+100000;
    while(Date.now()<deadline) {
      result=JSON.parse(query(`begin read only; select coalesce((select json_build_object('status',status,
        'finished',end_time is not null) from cron.job_run_details where jobid=${baseline.id}
          and start_time>'${since}'::timestamptz order by runid desc limit 1),'{}'::json); commit;`));
      if(result.finished) break;
      await delay(5000);
    }
    if(result?.status!=='succeeded' || !result.finished) throw Error('Real cleanup worker did not succeed');
    console.log(JSON.stringify({realWorker:'PASS',status:result.status,cleanupDetailsPrinted:false}));
  }
} catch(error) {console.error(error.message);process.exitCode=1;}
finally {
  if(altered) {
    try {
      query(readFileSync('supabase/operations/music-cleanup-cron.sql','utf8'));
      console.log('Cron schedule restored: hourly.');
    } catch {console.error('Hourly restoration failed: trusted operator must restore the named job immediately.');process.exitCode=1;}
  }
}
