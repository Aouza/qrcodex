import "server-only";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { parseMusicQueueRequestInput } from "@/lib/youtube-poc/validation";

export async function createMusicQueueRequest({ slug, payload }: { slug: string; payload: unknown }) {
  const parsed = parseMusicQueueRequestInput(payload);
  if (!parsed.ok) return { ok: false as const, error: parsed.error };
  try {
    const { data, error } = await createPublicClient().rpc("create_music_request", {
      tenant_slug: slug, video_id: parsed.videoId, title: parsed.title,
      channel_title: parsed.channelTitle, thumbnail_url: parsed.thumbnailUrl,
    }).maybeSingle();
    const row = z.object({ id: z.uuid() }).safeParse(data);
    if (error || !row.success) return { ok: false as const, error: "QUEUE_REQUEST_FAILED" };
    return { ok: true as const, request: { id: row.data.id } };
  } catch { return { ok: false as const, error: "QUEUE_REQUEST_FAILED" }; }
}
