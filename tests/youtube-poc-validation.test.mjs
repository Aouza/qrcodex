import assert from "node:assert/strict";
import test from "node:test";
import {
  buildYouTubePocOAuthUrl,
  mapYouTubeInsertError,
  parseMusicQueueRequestInput,
  parseSearchQuery,
  parseVideoRequestInput,
  upsertEnvValue,
  YOUTUBE_POC_OAUTH_SCOPE,
  YOUTUBE_POC_REDIRECT_URI,
} from "../src/lib/youtube-poc/validation.ts";

test("requires at least three search characters after trimming", () => {
  assert.deepEqual(parseSearchQuery("  deftones  "), { ok: true, query: "deftones" });
  assert.deepEqual(parseSearchQuery("ab"), { ok: false, error: "SEARCH_QUERY_TOO_SHORT" });
  assert.deepEqual(parseSearchQuery("   "), { ok: false, error: "SEARCH_QUERY_TOO_SHORT" });
});

test("accepts only a minimal videoId request payload", () => {
  assert.deepEqual(parseVideoRequestInput({ videoId: "dQw4w9WgXcQ" }), {
    ok: true,
    videoId: "dQw4w9WgXcQ",
  });

  assert.deepEqual(parseVideoRequestInput({ videoId: "dQw4w9WgXcQ", playlistId: "client-playlist" }), {
    ok: false,
    error: "UNEXPECTED_FIELD",
  });

  assert.deepEqual(parseVideoRequestInput({ videoId: "not a video id" }), {
    ok: false,
    error: "INVALID_VIDEO_ID",
  });
});

test("maps duplicate playlist insertion to a controlled result", () => {
  assert.deepEqual(mapYouTubeInsertError({ error: { errors: [{ reason: "videoAlreadyInPlaylist" }] } }), {
    ok: false,
    error: "VIDEO_ALREADY_IN_PLAYLIST",
  });

  assert.deepEqual(mapYouTubeInsertError({ error: { errors: [{ reason: "playlistItemsNotAccessible" }] } }), {
    ok: false,
    error: "YOUTUBE_INSERT_FAILED",
  });
});

test("builds a local-only OAuth authorization URL for offline playlist writes", () => {
  const url = new URL(buildYouTubePocOAuthUrl("client-id"));

  assert.equal(url.origin + url.pathname, "https://accounts.google.com/o/oauth2/v2/auth");
  assert.equal(url.searchParams.get("client_id"), "client-id");
  assert.equal(url.searchParams.get("redirect_uri"), YOUTUBE_POC_REDIRECT_URI);
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("access_type"), "offline");
  assert.equal(url.searchParams.get("prompt"), "consent");
  assert.equal(url.searchParams.get("scope"), YOUTUBE_POC_OAUTH_SCOPE);
});

test("upserts the refresh token in env content without exposing other values", () => {
  assert.equal(
    upsertEnvValue("YOUTUBE_CLIENT_ID=abc\nYOUTUBE_REFRESH_TOKEN=old\n", "YOUTUBE_REFRESH_TOKEN", "new-token"),
    "YOUTUBE_CLIENT_ID=abc\nYOUTUBE_REFRESH_TOKEN=new-token\n",
  );
  assert.equal(
    upsertEnvValue("YOUTUBE_CLIENT_ID=abc\n", "YOUTUBE_REFRESH_TOKEN", "new-token"),
    "YOUTUBE_CLIENT_ID=abc\nYOUTUBE_REFRESH_TOKEN=new-token\n",
  );
});

test("accepts only the queue request fields needed to create a music request", () => {
  assert.deepEqual(
    parseMusicQueueRequestInput({
      videoId: "dQw4w9WgXcQ",
      title: "Deftones - Change",
      channelTitle: "Deftones",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    }),
    {
      ok: true,
      videoId: "dQw4w9WgXcQ",
      title: "Deftones - Change",
      channelTitle: "Deftones",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    },
  );

  assert.deepEqual(
    parseMusicQueueRequestInput({
      videoId: "dQw4w9WgXcQ",
      title: "Deftones - Change",
      channelTitle: "Deftones",
      status: "playing",
    }),
    { ok: false, error: "UNEXPECTED_FIELD" },
  );

  assert.deepEqual(
    parseMusicQueueRequestInput({
      videoId: "dQw4w9WgXcQ",
      title: "",
      channelTitle: "Deftones",
    }),
    { ok: false, error: "INVALID_TITLE" },
  );
});
