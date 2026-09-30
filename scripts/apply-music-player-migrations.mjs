// Explicit production-only TASK-061 migration runner. Default operation is read-only.
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { spawnSync } from "node:child_process";

const config = parseEnv(readFileSync(".env.production.local", "utf8"));
if (!config.DATABASE_URL || !config.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Production database configuration missing");
const connection = new URL(config.DATABASE_URL);
const project = new URL(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
if (!connection.hostname.includes(project) && !decodeURIComponent(connection.username).includes(project)) {
  throw new Error("Database connection does not match the production Supabase project");
}
const env = {
  ...process.env,
  PGHOST: connection.hostname, PGPORT: connection.port || "5432",
  PGUSER: decodeURIComponent(connection.username), PGPASSWORD: decodeURIComponent(connection.password),
  PGDATABASE: decodeURIComponent(connection.pathname.slice(1)) || "postgres",
  PGSSLMODE: connection.searchParams.get("sslmode") || "require", PGCONNECT_TIMEOUT: "10",
  PGAPPNAME: "qrcodex-task061-migrations", PGOPTIONS: "-c statement_timeout=30000 -c lock_timeout=10000",
};
function query(sql) {
  const result = spawnSync(process.env.PSQL_BIN || "C:/Program Files/PostgreSQL/18/bin/psql.exe",
    ["-X", "-w", "-q", "-At", "-v", "ON_ERROR_STOP=1"], { env, input: sql, encoding: "utf8", timeout: 45000 });
  if (result.status !== 0) {
    let message = result.stderr || result.error?.code || "SQL operation failed";
    for (const secret of [config.DATABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, connection.password, env.PGPASSWORD]) {
      if (secret) message = message.replaceAll(secret, "[redacted]");
    }
    throw new Error(message);
  }
  return result.stdout.trim();
}
function inspect() {
  return JSON.parse(query(`select json_build_object(
    'queue', to_regclass('public.music_requests') is not null,
    'boundary', to_regprocedure('public.advance_music_player(uuid,uuid,text,integer)') is not null,
    'history', to_regclass('supabase_migrations.schema_migrations') is not null);`));
}
const state = inspect();
const versions = state.history ? query(`select version from supabase_migrations.schema_migrations
  where version in ('20260930000000','20260930000001') order by version;`).split(/\r?\n/).filter(Boolean) : [];
console.log(JSON.stringify({ productionDatabaseConfirmed: true, ...state, versions }));
if (!process.argv.includes("--apply")) process.exit(0);
if (state.queue && state.boundary && versions.length === 2) {
  console.log("Both migrations already applied; no changes."); process.exit(0);
}
if (state.queue || state.boundary || versions.length || !state.history) {
  throw new Error("Existing partial schema/history requires review before applying migrations");
}
const files = [
  ["20260930000000", "music_queue_poc"],
  ["20260930000001", "music_player_boundary"],
];
const quote = value => "'" + value.replaceAll("'", "''") + "'";
const statements = files.map(([version, name]) => {
  const sql = readFileSync(`supabase/migrations/${version}_${name}.sql`, "utf8");
  return `${sql}\ninsert into supabase_migrations.schema_migrations(version,name,statements)
    values(${quote(version)},${quote(name)},ARRAY[${quote(sql)}]);`;
});
query(`begin; select pg_advisory_xact_lock(hashtext('qrcodex-task061-migrations'));
  ${statements.join("\n")}
  notify pgrst, 'reload schema'; commit;`);
console.log("Applied both TASK-061 migrations atomically and recorded migration history.");
console.log(JSON.stringify(inspect()));
console.log(query(`select json_build_object(
  'anonymousDirectUpdate', has_table_privilege('anon','public.music_requests','UPDATE'),
  'memberDirectUpdate', has_table_privilege('authenticated','public.music_requests','UPDATE'),
  'anonymousClaim', has_function_privilege('anon','public.claim_next_music_request(uuid)','EXECUTE'),
  'memberClaim', has_function_privilege('authenticated','public.claim_next_music_request(uuid)','EXECUTE'),
  'serverClaim', has_function_privilege('service_role','public.claim_next_music_request(uuid)','EXECUTE'));`));
