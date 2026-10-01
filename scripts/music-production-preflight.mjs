// Read-only production database preflight; no queue data or secrets are printed.
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { spawnSync } from "node:child_process";
const config = parseEnv(readFileSync(".env.production.local", "utf8"));
function safeUrl(value) {
  try { return new URL(value); } catch { throw Error("Production connection configuration invalid"); }
}
const connection = safeUrl(config.DATABASE_URL);
const project = safeUrl(config.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
if (!connection.hostname.includes(project) && !decodeURIComponent(connection.username).includes(project))
  throw Error("Production database target mismatch");
const env = { ...process.env, PGHOST: connection.hostname, PGPORT: connection.port || "5432",
  PGUSER: decodeURIComponent(connection.username), PGPASSWORD: decodeURIComponent(connection.password),
  PGDATABASE: connection.pathname.slice(1) || "postgres", PGSSLMODE: "require", PGCONNECT_TIMEOUT: "10",
  PGAPPNAME: "qrcodex-task058-readonly", PGOPTIONS: "-c statement_timeout=15000 -c lock_timeout=5000" };
const sql = `begin read only; select json_build_object(
  'productionTargetConfirmed',true,
  'musicVersions',coalesce((select json_agg(version order by version) from supabase_migrations.schema_migrations
    where version like '20260930%'),'[]'::json),
  'productionSettingsExist',to_regclass('public.music_settings') is not null,
  'pgCronInstalled',exists(select 1 from pg_extension where extname='pg_cron'),
  'queueRows',(select count(*) from public.music_requests),
  'playingRows',(select count(*) from public.music_requests where status='playing'),
  'multiplePlayingTenants',(select count(*) from (select establishment_id from public.music_requests
    where status='playing' group by establishment_id having count(*)>1) invalid)
);commit;`;
const result = spawnSync(process.env.PSQL_BIN || "C:/Program Files/PostgreSQL/18/bin/psql.exe",
  ["-X", "-w", "-q", "-At", "-v", "ON_ERROR_STOP=1"], { env, input: sql, encoding: "utf8", timeout: 30000 });
if (result.status !== 0) {
  // Connection/SQL diagnostics may contain credentials or rows: do not print them.
  console.error("Production preflight unavailable; no writes performed."); process.exitCode = 1;
} else console.log(result.stdout.trim());
