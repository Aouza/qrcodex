import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Deliberately offline: no env files, subprocesses, database or network access.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
function markdownFiles(directory) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`;
    return entry.isDirectory() ? markdownFiles(file) : file.endsWith(".md") ? [file] : [];
  });
}
const docs = markdownFiles("docs");
const tasks = markdownFiles("tasks");
const entrypoints = ["AGENTS.md", "README.md", "CODEX_START_PROMPT.md", "CLAUDE.md"];
const historical = (file) => file.startsWith("docs/site/reference/")
  || ["docs/PRD_BAR_HUB_V2.md", "docs/music/HANDOFF-2026-11-13.md"].includes(file);
const errors = [];
let linkCount = 0;

// Validate inline Markdown links outside code fences. Fragment validity and
// backtick/plain-text references require semantic review (see GOVERNANCE).
for (const file of [...entrypoints, ...docs, ...tasks].filter((file) => !historical(file))) {
  const content = read(file).replace(/^\s*(```|~~~)[\s\S]*?^\s*\1[^\n]*$/gm, "");
  for (const match of content.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\s*\)/g)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(target)) continue;
    const local = decodeURIComponent(target.split(/[?#]/)[0]);
    if (!local) continue;
    linkCount++;
    const resolved = path.resolve(root, path.dirname(file), local);
    if (!resolved.startsWith(`${root}${path.sep}`) || !fs.existsSync(resolved)) {
      errors.push(`${file}: missing/outside local link ${target}`);
    }
  }
}

const catalogFile = "docs/CATALOG.md";
const catalog = fs.existsSync(path.join(root, catalogFile)) ? read(catalogFile) : "";
const registered = new Set();
for (const match of catalog.matchAll(/\u0060(docs\/[^\u0060]+\.md)\u0060/g)) {
  if (registered.has(match[1])) errors.push(`${match[1]}: duplicate documentation inventory entry`);
  registered.add(match[1]);
  if (!docs.includes(match[1])) errors.push(`${match[1]}: stale documentation inventory entry`);
}
for (const file of docs) {
  if (!registered.has(file)) errors.push(`${file}: absent from documentation inventory`);
}

const backlog = new Map();
for (const match of read("tasks/BACKLOG.md").matchAll(/^\| (TASK-\d+) \| [^\n|]+ \| (PLANNED|READY|IN_PROGRESS|BLOCKED|DONE) \|/gm)) {
  if (backlog.has(match[1])) errors.push(`BACKLOG: duplicate ${match[1]}`);
  backlog.set(match[1], match[2]);
}
const taskFiles = new Map();
for (const file of tasks.filter((file) => /\/TASK-\d+[^/]*\.md$/.test(file))) {
  const id = path.basename(file).match(/^TASK-\d+/)[0];
  if (taskFiles.has(id)) errors.push(`Task ID duplicated: ${id}`);
  taskFiles.set(id, file);
  const content = read(file);
  const status = content.match(/^\*\*Status:\*\*\s*(PLANNED|READY|IN_PROGRESS|BLOCKED|DONE)\b/m)?.[1];
  if (!backlog.has(id)) errors.push(`${file}: no backlog entry`);
  else if (backlog.get(id) !== status) errors.push(`${id}: file=${status ?? "missing"}, backlog=${backlog.get(id)}`);
  const expectedDirectory = status === "DONE" ? "completed" : status === "PLANNED" ? "planned" : "active";
  if (!file.startsWith(`tasks/${expectedDirectory}/`)) errors.push(`${id}: status ${status} requires ${expectedDirectory}/`);
}
// Explicit, documented legacy placeholders: detailed before promotion.
const placeholders = new Set(["TASK-029", "TASK-030"]);
for (const [id, status] of backlog) {
  if (!taskFiles.has(id) && !(placeholders.has(id) && status === "PLANNED")) errors.push(`${id}: backlog entry has no task file`);
}
for (const id of placeholders) {
  if (!read("tasks/README.md").includes(id)) errors.push(`${id}: undocumented placeholder exception`);
}
const current = read("tasks/CURRENT.md");
const implementation = current.split("## Próxima implementação\n")[1]?.split("\n## ")[0];
const nextId = implementation?.match(/TASK-\d+/)?.[0];
if (!nextId || !["READY", "IN_PROGRESS"].includes(backlog.get(nextId))) {
  errors.push("CURRENT: next implementation must reference a READY/IN_PROGRESS task");
}
const manualTracks = new Set(["TASK-058", "TASK-061"]);
const implementations = [...backlog].filter(([id, status]) => status === "IN_PROGRESS" && !manualTracks.has(id));
if (implementations.length > 1) errors.push("More than one product implementation IN_PROGRESS");
for (const id of manualTracks) {
  if (backlog.get(id) === "IN_PROGRESS" && !current.includes(`[${id}]`)) errors.push(`${id}: manual track missing from CURRENT`);
}
if (errors.length) {
  console.error(errors.map((error) => `ERROR ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Docs OK: ${docs.length} inventoried Markdown files, ${linkCount} local links, ${taskFiles.size} task files; next ${nextId}.`);
  console.log("Known planned placeholders: TASK-029/TASK-030. Historical references preserved; content/fragment/production validation remains manual.");
}
