import { z } from "zod";

const identity = z.object({ id: z.uuid().nullable() });
const track = z.object({
  id: z.uuid(), youtube_video_id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string().min(1), channel_title: z.string().min(1),
});

// RPCs return a table composite; singular representation is requested by the
// server. SQL NULL can be represented as a record with null-valued columns.
export function parsePlaybackRow(value: unknown) {
  if (value === null || identity.parse(value).id === null) return null;
  const row = track.parse(value);
  return { id: row.id, videoId: row.youtube_video_id, title: row.title, channelTitle: row.channel_title };
}
