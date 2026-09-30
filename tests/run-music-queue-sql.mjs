// Draft migrations and assertions run in one rolled-back transaction.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const env = { ...process.env, PGDATABASE: process.env.DATABASE_URL, PGCONNECT_TIMEOUT: "10" };
function psql(sql) {
  const result = spawnSync("psql", ["-X", "-w", "-q", "-At", "-v", "ON_ERROR_STOP=1"], { env, input: sql, encoding: "utf8", timeout: 25000 });
  if (result.status !== 0) {
    console.error((result.stderr || `SQL connection failed: ${result.error?.code ?? "psql unavailable"}`).replaceAll(process.env.DATABASE_URL, "[redacted]"));
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}
const exists = psql("select to_regclass('public.music_requests') is not null;") === "t";
const boundary = psql("select to_regprocedure('public.advance_music_player(uuid,uuid,text,integer)') is not null;") === "t";
if (process.argv.includes("--inspect")) {
  console.log(`Queue schema: ${exists ? "present" : "missing"}; player boundary: ${boundary ? "present" : "missing"}`);
} else {
  const migrations = [
    ...(!exists ? ["supabase/migrations/20260930000000_music_queue_poc.sql"] : []),
    ...(!boundary ? ["supabase/migrations/20260930000001_music_player_boundary.sql"] : []),
  ];
  const sql = readFileSync("supabase/tests/013_music_queue_poc.sql", "utf8").replace(/^begin;\s*/i, "").replace(/rollback;\s*$/i, "");
  psql(`begin;\n${migrations.map(path => readFileSync(path, "utf8")).join("\n")}\n${sql}\nrollback;`);
  console.log("SQL PASS (draft migrations + assertions; rolled back, remote schema unchanged)");
}
