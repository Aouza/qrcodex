import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { createClient } from "@supabase/supabase-js";

const sourceRoot = new URL("../../src/", import.meta.url);
const stubs = new Map([
  ["@/lib/supabase/public", "export const createPublicClient = () => globalThis.publicEventTestClient;"],
  ["@/lib/music/runtime", "export const productionMusicEnabled = () => false;"],
  ["@/lib/music/database", "export const musicAvailability = () => { throw Error('Unexpected Music read'); };"],
]);

// Resolve the application's TS imports on the existing Node 24 test runtime.
// Only infrastructure is stubbed: loaders, resolvers and date rules are real.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (stubs.has(specifier)) {
      return { url: `data:text/javascript,${encodeURIComponent(stubs.get(specifier))}`, shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`${specifier.slice(2)}.ts`, sourceRoot).href, context);
    }
    if (specifier.startsWith(".") && context.parentURL?.startsWith(sourceRoot.href) && !/\.[a-z]+$/.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

export const { loadPublicHub } = await import("../../src/lib/hub/load-public-hub.ts");
export const { loadPublicAgenda } = await import("../../src/lib/agenda/load-public-agenda.ts");
export const { hasPublicMusic, resolvePublicHubResult } = await import("../../src/lib/hub/resolve-public-hub-result.ts");
export const { resolvePublicAgendaResult } = await import("../../src/lib/agenda/resolve-public-agenda-result.ts");

function splitTerms(expression) {
  let depth = 0;
  let start = 0;
  const terms = [];
  for (let index = 0; index < expression.length; index++) {
    if (expression[index] === "(") depth++;
    if (expression[index] === ")") depth--;
    if (expression[index] === "," && depth === 0) {
      terms.push(expression.slice(start, index));
      start = index + 1;
    }
  }
  return [...terms, expression.slice(start)];
}

function matches(row, expression) {
  const group = /^(and|or)\((.*)\)$/.exec(expression);
  if (group) {
    const terms = splitTerms(group[2]);
    return group[1] === "and" ? terms.every(term => matches(row, term)) : terms.some(term => matches(row, term));
  }
  const condition = /^([a-z_]+)\.(eq|is|gte)\.(.*)$/.exec(expression);
  assert.ok(condition, `Unsupported fixture predicate: ${expression}`);
  const [, field, operator, value] = condition;
  if (operator === "is") return value === "null" && row[field] === null;
  if (operator === "gte") return row[field] !== null && Date.parse(row[field]) >= Date.parse(value);
  return String(row[field]) === value;
}

export function eventLoaderFixture(establishment, rows) {
  const requests = [];
  globalThis.publicEventTestClient = createClient("https://fixture.invalid", "fixture-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: async (input) => {
        const url = new URL(input);
        requests.push(url);
        let data = url.pathname.endsWith("/establishments") ? [{ ...establishment, active: true }] : [...rows];
        for (const [field, expression] of url.searchParams) {
          if (expression.startsWith("eq.")) data = data.filter(row => matches(row, `${field}.${expression}`));
        }
        const or = url.searchParams.get("or");
        if (or) data = data.filter(row => matches(row, `or${or}`));
        const order = url.searchParams.get("order");
        if (order) {
          const fields = order.split(",").map(value => value.split(".")[0]);
          data.sort((left, right) => {
            for (const field of fields) {
              const comparison = String(left[field]).localeCompare(String(right[field]));
              if (comparison) return comparison;
            }
            return 0;
          });
        }
        const limit = url.searchParams.get("limit");
        if (limit !== null) data = data.slice(0, Number(limit));
        return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
      },
    },
  });
  return { requests, eventRequest: () => requests.find(url => url.pathname.endsWith("/events")) };
}
