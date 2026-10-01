// Isolated real PostgreSQL integration/concurrency tests. Supabase Auth roles
// and realtime.send are modeled locally; hosted WebSocket delivery is manual QA.
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

const directory = mkdtempSync(join(tmpdir(), "qrcodex-music-sql-"));
const bin = process.env.PG_BIN ?? "C:/Program Files/PostgreSQL/18/bin";
const executable = name => join(bin, process.platform === "win32" ? `${name}.exe` : name);
function command(name, args, options = {}) {
  const result = spawnSync(executable(name), args, { encoding: "utf8", timeout: 30000, ...options });
  if (result.status !== 0) throw new Error(`${name}: ${result.stderr || result.error?.code || result.stdout}`);
  return result.stdout;
}
const server = createServer();
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
await new Promise(resolve => server.close(resolve));
const env = { ...process.env, PGHOST: "127.0.0.1", PGPORT: String(port), PGDATABASE: "postgres", PGUSER: "postgres", PGCONNECT_TIMEOUT: "5" };
const args = ["-X", "-w", "-q", "-At", "-v", "ON_ERROR_STOP=1"];
const sql = value => command("psql", args, { env, input: value });
let started = false;
try {
  command("initdb", ["-D", directory, "--auth=trust", "--username=postgres", "--encoding=UTF8", "--no-locale"]);
  command("pg_ctl", ["-D", directory, "-l", join(directory, "server.log"), "-o", `-p ${port} -h 127.0.0.1`, "-w", "start"]);
  started = true;
  sql(`
    create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema public to service_role;
    alter default privileges in schema public grant all on tables to service_role;
    alter default privileges in schema public grant execute on functions to service_role;
    create schema auth;
    create table auth.users(id uuid primary key, aud text, role text, email text);
    create function auth.uid() returns uuid language sql stable as
      'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
    create schema realtime;
    create table realtime.test_messages(payload jsonb, event text, topic text, private boolean);
    create function realtime.send(payload jsonb, event text, topic text, private boolean default true)
      returns void language sql as 'insert into realtime.test_messages values ($1, $2, $3, $4)';
  `);
  for (const path of [
    "supabase/migrations/20260921000000_initial_schema.sql",
    "supabase/migrations/20260921000001_rls_tenant_authorization.sql",
    "supabase/migrations/20260930000000_music_queue_poc.sql",
    "supabase/migrations/20260930000001_music_player_boundary.sql",
    "supabase/tests/013_music_queue_poc.sql",
  ]) sql(readFileSync(path, "utf8"));

  const tenant = "11111111-1111-4111-8111-111111111111";
  sql(`insert into public.establishments(id,name,slug) values('${tenant}', 'Concurrency test', 'concurrency-test');
    select public.music_player_topic('${tenant}');
    select public.create_music_request('concurrency-test','aaaaaaaaaaa','First','Channel',null);
    select public.create_music_request('concurrency-test','bbbbbbbbbbb','Second','Channel',null);
    update public.music_requests set requested_at = case youtube_video_id when 'aaaaaaaaaaa' then '2026-01-01'::timestamptz else '2026-01-02'::timestamptz end;`);
  const concurrent = query => new Promise((resolve, reject) => {
    const child = spawn(executable("psql"), args, { env });
    let output = "", error = "";
    child.stdout.on("data", chunk => { output += chunk; });
    child.stderr.on("data", chunk => { error += chunk; });
    child.on("error", reject);
    child.on("close", code => code === 0 ? resolve(output.trim()) : reject(new Error(error)));
    child.stdin.end(query);
  });
  const claims = await Promise.all(Array.from({ length: 8 }, () => concurrent(`set role service_role;
    select (public.claim_next_music_request('${tenant}')).id;`)));
  if (new Set(claims).size !== 1) throw new Error("Concurrent claims returned different tracks");
  const advances = await Promise.all(Array.from({ length: 8 }, () => concurrent(`set role service_role;
    select (public.advance_music_player('${tenant}', '${claims[0]}', 'ended')).id;`)));
  if (new Set(advances).size !== 1 || advances[0] === claims[0]) throw new Error("Concurrent ENDED advanced incorrectly");
  const result = sql(`select count(*) from public.music_requests where establishment_id = '${tenant}' and status = 'playing';
    select count(*) from public.music_requests where establishment_id = '${tenant}' and status = 'played';
    select count(*) from realtime.test_messages where payload <> '{}'::jsonb or event <> 'wake' or private;`).trim();
  if (result !== "1\n1\n0" && result !== "1\r\n1\r\n0") throw new Error(`Concurrency/broadcast invariants failed: ${result}`);
  console.log("SQL PASS: local PostgreSQL RLS/lifecycle/FIFO/stale events + 8 concurrent claims/events; broadcasts contain no queue data.");
  if (process.argv.includes("--production")) {
    // Still the newly-created isolated loopback database: never reads .env files.
    const historyBefore = sql("select string_agg(id::text||':'||status,',' order by id) from public.music_requests;").trim();
    for (const path of [
      "supabase/migrations/20260930000002_music_production_schema.sql",
      "supabase/migrations/20260930000003_music_production_rpcs.sql",
      "supabase/migrations/20260930000004_music_production_admission.sql",
      "supabase/migrations/20260930000005_music_cleanup_schedule_margin.sql",
      "supabase/migrations/20260930000006_music_admin_snapshot.sql",
      "supabase/migrations/20260930000007_music_short_pairing.sql",
      "supabase/tests/014_music_production.sql",
      "supabase/tests/015_music_admin_snapshot.sql",
    ]) sql(readFileSync(path, "utf8"));
    if (sql("select string_agg(id::text||':'||status,',' order by id) from public.music_requests;").trim() !== historyBefore)
      throw new Error("Production migration changed existing queue/history IDs or statuses");
    // Contract fixture only: local PostgreSQL has no pg_cron worker. Hosted
    // execution and monitoring must still be verified on Supabase.
    sql(`create schema cron;
      revoke all on schema cron from public;
      create table cron.job(jobid bigint generated always as identity primary key,
        jobname text, schedule text, command text, database text default current_database(),
        username text default current_user, active boolean default true,
        unique(jobname,username,database));
      create function cron.schedule(text,text,text) returns bigint language plpgsql as $$
      declare result bigint; begin
        insert into cron.job(jobname,schedule,command) values($1,$2,$3)
        on conflict(jobname,username,database) do update
          set schedule=excluded.schedule,command=excluded.command,active=true
        returning jobid into result; return result; end $$;
      revoke all on function cron.schedule(text,text,text) from public;
      insert into cron.job(jobname,schedule,command) values('unrelated','0 2 * * *','select 1;');`);
    const scheduler = readFileSync("supabase/operations/music-cleanup-cron.sql", "utf8");
    sql(scheduler); sql(scheduler);
    const scheduled = sql(`select count(*) from cron.job where jobname='relicas-music-cleanup-hourly'
      and active and schedule='0 * * * *' and username='postgres'
      and command='set statement_timeout = ''5min''; set lock_timeout = ''5s''; select public.music_cleanup();';
      select count(*) from cron.job where jobname='unrelated' and command='select 1;';
      select has_schema_privilege('anon','cron','usage') or has_schema_privilege('authenticated','cron','usage')
        or has_schema_privilege('service_role','cron','usage');`).trim().replaceAll('\r','');
    if (scheduled !== '1\n1\nf') throw new Error('Cleanup scheduler contract failed');
    const denied = spawnSync(executable('psql'), args, {env, input:`set role service_role;\n${scheduler}`, encoding:'utf8'});
    if (denied.status === 0) throw new Error('Application role configured cleanup cron');
    console.log("SQL PASS: production boundaries and scheduler contract (mock cron; hosted worker not tested).");
    const productionTenant = "55000000-0000-4000-8000-000000000001";
    const instance = "55000000-0000-4000-8000-000000000002";
    const boot = "55000000-0000-4000-8000-000000000003";
    const retry = "55000000-0000-4000-8000-000000000004";
    sql(`insert into public.establishments(id,name,slug) values('${productionTenant}','Production concurrency','prod-concurrency');
      insert into public.music_settings(establishment_id,music_enabled,requests_enabled) values('${productionTenant}',true,true);
      insert into private.music_devices(token_hash,establishment_id) values(repeat('a',64),'${productionTenant}');
      insert into public.music_requests(establishment_id,youtube_video_id,title,channel_title,requested_at) values
        ('${productionTenant}','eeeeeeeeeee','First','Channel',clock_timestamp()-interval '2 seconds'),
        ('${productionTenant}','fffffffffff','Second','Channel',clock_timestamp()-interval '1 second');`);
    const state = () => `public.music_player_state('prod-concurrency',repeat('a',64),'${instance}','${boot}')`;
    const productionClaims = await Promise.all(Array.from({ length: 8 }, () => concurrent(`set role service_role; select ${state()};`)));
    const initial = JSON.parse(productionClaims[0]);
    if (new Set(productionClaims.map(value => JSON.parse(value).track.id)).size !== 1 ||
      new Set(productionClaims.map(value => JSON.parse(value).playbackGeneration)).size !== 1) throw new Error("Production atomic claim/generation failed");
    sql(`set role service_role; select public.music_player_heartbeat('prod-concurrency',repeat('a',64),'${instance}',${initial.leaseGeneration},true);`);
    const admit = (visitor, network, key) => `public.music_admit_request('prod-concurrency','${visitor}','${network}','${key}',
      'ggggggggggg','Third','Channel',null,clock_timestamp())`;
    const admissions = await Promise.all(Array.from({ length: 8 }, () => concurrent(`set role service_role;
      select ${admit("1".repeat(64), "2".repeat(64), retry)}->>'requestId';`)));
    if (new Set(admissions).size !== 1 || !admissions[0]) throw new Error("Concurrent receipt/idempotency failed");
    const ended = `public.music_player_event('prod-concurrency',repeat('a',64),'${instance}',${initial.leaseGeneration},
      ${initial.playbackGeneration},'${initial.track.id}','ended')`;
    const productionEvents = await Promise.all(Array.from({ length: 8 }, () => concurrent(`set role service_role; select ${ended}->'track'->>'id';`)));
    if (new Set(productionEvents).size !== 1 || productionEvents[0] === initial.track.id || !productionEvents[0]) throw new Error("Concurrent production ENDED failed");
    if (sql(`select count(*) from public.music_requests where establishment_id='${productionTenant}' and status='played';`).trim() !== "1")
      throw new Error("Duplicate ENDED transitioned more than once");
    // A capacity slot and a quota unit cannot be double-spent by serverless callers.
    sql(`update public.music_settings set queue_limit=2 where establishment_id='${productionTenant}';
      update private.music_quota set daily_budget=2,used_units=0,quota_day=null;`);
    const capacity = await Promise.all(Array.from({ length: 8 }, (_, index) => concurrent(`set role service_role;
      select ${admit(String(index + 3).padStart(64, "0"), "3".repeat(64), `55000000-0000-4000-8000-${String(index + 10).padStart(12, "0")}`)}->>'status';`)));
    if (capacity.filter(value => value === "accepted").length !== 1 || capacity.filter(value => value === "full").length !== 7)
      throw new Error("Concurrent capacity overrun");
    const quota = await Promise.all(Array.from({ length: 8 }, (_, index) => concurrent(`set role service_role;
      select public.music_reserve_api('prod-concurrency','${String(index + 20).padStart(64, "0")}',repeat('4',64),'search',1)->>'status';`)));
    if (quota.filter(value => value === "reserved").length !== 2 || quota.filter(value => value === "quota_exhausted").length !== 6)
      throw new Error("Concurrent quota overrun");
    console.log("SQL PASS: 8 concurrent production claims, idempotent admissions, duplicate ENDED, capacity and quota reservations.");
    const admin = "56000000-0000-4000-8000-000000000001";
    sql(`insert into auth.users(id,aud,role,email) values('${admin}','authenticated','authenticated','concurrent-admin@example.test');
      insert into public.establishment_users(establishment_id,user_id) values('${productionTenant}','${admin}');`);
    const asAdmin = statement => `set role authenticated; select set_config('request.jwt.claim.sub','${admin}',false); ${statement}`;
    const beforeSkip = JSON.parse(sql(`set role service_role;select ${state()};`));
    const skips = await Promise.all(Array.from({length:8},()=>concurrent(asAdmin(`select public.music_admin_skip('${productionTenant}','${beforeSkip.track.id}');`))));
    if(skips.filter(v=>v.endsWith("t")).length!==1)throw Error("Concurrent skip must transition exactly once");
    const afterSkip = JSON.parse(sql(`set role service_role;select ${state()};`));
    const stale = JSON.parse(sql(`set role service_role;select public.music_player_event('prod-concurrency',repeat('a',64),'${instance}',
      ${beforeSkip.leaseGeneration},${beforeSkip.playbackGeneration},'${beforeSkip.track.id}','ended');`));
    if(stale.track?.id!==afterSkip.track?.id||stale.playbackGeneration!==afterSkip.playbackGeneration)throw Error("Old ENDED after admin skip advanced replacement");
    const queued = sql(`select id from public.music_requests where establishment_id='${productionTenant}' and status='queued' order by requested_at,id limit 1;`).trim();
    const removes = await Promise.all(Array.from({length:8},()=>concurrent(asAdmin(`select public.music_admin_remove('${productionTenant}','${queued}');`))));
    if(removes.filter(v=>v.endsWith("t")).length!==1)throw Error("Concurrent remove must transition exactly once");
    sql(`update public.music_settings set queue_limit=30 where establishment_id='${productionTenant}';`);
    for(let phone=1;phone<=2;phone++) {
      const answer=JSON.parse(sql(`set role service_role;select ${admit(String(phone+90).padStart(64,"0"),"7".repeat(64),`57000000-0000-4000-8000-${String(phone).padStart(12,"0")}`)};`));
      if(answer.status!=="accepted")throw Error("Distinct legitimate visitors on shared Wi-Fi were blocked");
    }
    console.log("SQL PASS: concurrent admin skip/remove, stale ENDED after skip, and separate phone visitors on shared Wi-Fi.");
  }
} finally {
  if (started) command("pg_ctl", ["-D", directory, "-m", "fast", "-w", "stop"]);
  // Leave generated files in OS temp for diagnosis; no user repository data is removed.
}
