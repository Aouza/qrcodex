// Read-only Vercel preflight. Never print token or environment values.
import { readFileSync } from "node:fs";
import { join } from "node:path";
const project = JSON.parse(readFileSync(".vercel/project.json", "utf8"));
const auth = JSON.parse(readFileSync(join(process.env.APPDATA, "com.vercel.cli/Data/auth.json"), "utf8"));
if (!auth.token) throw Error("Vercel authentication unavailable");
async function get(path, label) {
  const response = await fetch(`https://api.vercel.com${path}`, {
    headers: { Authorization: `Bearer ${auth.token}` }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const code = payload?.error?.code;
    throw Error(`Vercel ${label} HTTP ${response.status}${typeof code === "string" && /^[a-z0-9_-]+$/i.test(code) ? ` (${code})` : ""}`);
  }
  return response.json();
}
try {
  const [settings, team, variables] = await Promise.all([
    get(`/v9/projects/${project.projectId}?teamId=${project.orgId}`, "project"),
    get(`/v2/teams/${project.orgId}`, "team"),
    get(`/v9/projects/${project.projectId}/env?teamId=${project.orgId}`, "environment"),
  ]);
  console.log(JSON.stringify({ project: settings.name, plan: team.billing?.plan ?? null, gitLinked: !!settings.link,
    previewProtection: settings.ssoProtection ?? null, passwordProtection: !!settings.passwordProtection,
    framework: settings.framework, productionBranch: settings.link?.productionBranch ?? null,
    previewEnvironmentNames: variables.envs.filter(e => e.target?.includes("preview")).map(e => ({ key: e.key, branch: e.gitBranch ?? null })),
    musicApiKeyConfigured: variables.envs.some(e => e.key === "YOUTUBE_MUSIC_API_KEY"),
    productionEnvironmentNames: variables.envs.filter(e => e.target?.includes("production")).map(e => e.key),
  }));
} catch (error) {
  console.error(error.message === "fetch failed" ? "Vercel preflight network unavailable" : error.message);
  process.exitCode = 1;
}
