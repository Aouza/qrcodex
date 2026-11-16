import { z } from "zod";

const track = z.object({
  id: z.uuid(), title: z.string().min(1).max(500), channelTitle: z.string().min(1).max(250),
  requestedAt: z.iso.datetime({ offset: true }),
}).strict();
export const adminMusicSnapshot = z.object({
  enabled: z.boolean(), requestsEnabled: z.boolean(), online: z.boolean(), paired: z.boolean(),
  topic: z.string().startsWith("music-poc:"), current: track.nullable(), queue: z.array(track).max(100),
}).strict();
export type AdminMusicSnapshot = z.infer<typeof adminMusicSnapshot>;
export const adminMusicCommand = z.discriminatedUnion("operation", [
  z.object({ operation: z.literal("settings"), enabled: z.boolean(), requestsEnabled: z.boolean() }).strict(),
  z.object({ operation: z.literal("pair"), replace: z.boolean() }).strict(),
  z.object({ operation: z.literal("revoke"), confirmed: z.literal(true) }).strict(),
  z.object({ operation: z.literal("skip"), requestId: z.uuid(), confirmed: z.literal(true) }).strict(),
  z.object({ operation: z.literal("remove"), requestId: z.uuid(), confirmed: z.literal(true) }).strict(),
]);
export type AdminMusicCommand = z.infer<typeof adminMusicCommand>;
export type AdminMusicResult = { message?: string; error?: string; pairingCode?: string };

// The tenant comes exclusively from server-resolved membership, never a form.
export function adminRpcInstruction(tenant: string, command: AdminMusicCommand) {
  const args: Record<string, unknown> = { p_tenant: tenant };
  switch (command.operation) {
    case "settings": return { name: "music_admin_settings", args: { ...args, p_enabled: command.enabled, p_requests: command.requestsEnabled } };
    case "pair": return { name: "music_admin_pair", args: { ...args, p_replace: command.replace } };
    case "revoke": return { name: "music_admin_revoke", args };
    case "skip": return { name: "music_admin_skip", args: { ...args, p_request: command.requestId } };
    case "remove": return { name: "music_admin_remove", args: { ...args, p_request: command.requestId } };
  }
}
