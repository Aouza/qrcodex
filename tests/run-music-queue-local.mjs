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
} finally {
  if (started) command("pg_ctl", ["-D", directory, "-m", "fast", "-w", "stop"]);
  // Leave generated files in OS temp for diagnosis; no user repository data is removed.
}
