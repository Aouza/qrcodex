import { z } from "zod";
export const musicSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
const base = { slug: musicSlug };
export const publicInput = z.discriminatedUnion("operation", [
  z.object({ ...base, operation: z.literal("consent"), accepted: z.literal(true) }).strict(),
  z.object({ ...base, operation: z.literal("search"), query: z.string().trim().min(3).max(100) }).strict(),
  z.object({ ...base, operation: z.literal("request"), videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/), retryId: z.uuid() }).strict(),
]);
const device = { ...base, instanceId: z.uuid(), bootId: z.uuid() };
const generation = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const playerInput = z.discriminatedUnion("operation", [
  z.object({ ...device, operation: z.literal("state") }).strict(),
  z.object({ ...device, operation: z.literal("heartbeat"), leaseGeneration: generation, ready: z.boolean() }).strict(),
  z.object({ ...device, operation: z.literal("ended"), leaseGeneration: generation, playbackGeneration: generation, requestId: z.uuid() }).strict(),
  z.object({ ...device, operation: z.literal("error"), leaseGeneration: generation, playbackGeneration: generation, requestId: z.uuid(),
    errorCode: z.union([z.literal(2),z.literal(5),z.literal(100),z.literal(101),z.literal(150),z.literal(153)]) }).strict(),
]);
export const musicTrack = z.object({ id:z.uuid(),videoId:z.string().regex(/^[A-Za-z0-9_-]{11}$/),title:z.string().min(1).max(500),channelTitle:z.string().min(1).max(250) });
export const playbackSchema = z.object({ status:z.enum(["waiting","playing"]), leaseGeneration:generation,
  playbackGeneration:generation,leaseExpiresAt:z.iso.datetime({ offset:true }),topic:z.string().startsWith("music-poc:"),track:musicTrack.nullable() });
export type MusicTrack = z.infer<typeof musicTrack>;
export type PlaybackState = z.infer<typeof playbackSchema>;
export type PlayerCommand = z.infer<typeof playerInput>;
export type StopState = "unauthorized" | "disabled" | "busy" | "lease_lost";
export type PlayerReply = PlaybackState | { status: StopState };
