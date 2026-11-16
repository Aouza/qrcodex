import "server-only";

export type SiteContext = { slug: "relicas"; mode: "site"; host: string };

function normalizeHost(value: string | null | undefined): string | null {
  if (!value || value.length > 259) return null;
  const match = /^(\[::1\]|[a-z0-9.-]+)(?::([1-9]\d{0,4}))?$/i.exec(value);
  if (!match) return null;
  const hostname = match[1].toLowerCase();
  const port = match[2];
  if (hostname !== "[::1]" && (hostname.length > 253 || hostname.split(".").some(label =>
    label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)))) return null;
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  if (port && (!loopback || Number(port) > 65535)) return null;
  return port ? `${hostname}:${port}` : hostname;
}

export function resolveSiteContext(host: string | null | undefined): SiteContext | null {
  const normalized = normalizeHost(host);
  if (!normalized) return null;
  // No inferred domains, suffix/wildcard match, deployment env fallback or
  // tenant supplied by the browser. Invalid operator configuration fails closed.
  const allowed = (process.env.SITE_ALLOWED_HOSTS ?? "").split(",").map(value => normalizeHost(value.trim()));
  if (allowed.some(value => value === null) || !allowed.includes(normalized)) return null;
  return { slug: "relicas", mode: "site", host: normalized };
}

export function resolveSiteContextFromHeaders(headers: Pick<Headers, "get">): SiteContext | null {
  // Read from the actual server request. Never fall back to forwarded/browser
  // claims. This selects public presentation only, not admin authorization.
  return resolveSiteContext(headers.get("host"));
}
