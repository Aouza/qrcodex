import assert from "node:assert/strict";
import test from "node:test";
import { parsePlaybackRow } from "../src/lib/youtube-poc/playback-row.ts";

test("singular RPC record becomes minimal playback instruction without queue metadata", () => {
  const row = { id: "11111111-1111-4111-8111-111111111111", youtube_video_id: "aaaaaaaaaaa",
    title: "Track", channel_title: "Channel", establishment_id: "private-tenant", requested_at: "private" };
  assert.deepEqual(parsePlaybackRow(row), { id: row.id, videoId: row.youtube_video_id, title: "Track", channelTitle: "Channel" });
});
test("null composite waits; unexpected or array-shaped data fails closed", () => {
  assert.equal(parsePlaybackRow(null), null);
  assert.equal(parsePlaybackRow({ id: null, youtube_video_id: null }), null);
  assert.throws(() => parsePlaybackRow({}));
  assert.throws(() => parsePlaybackRow([]));
  assert.throws(() => parsePlaybackRow({ id: "not-a-uuid" }));
});
