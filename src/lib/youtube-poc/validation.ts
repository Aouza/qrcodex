export type ValidationResult<T, E extends string> =
  | { ok: true; [key: string]: T | true }
  | { ok: false; error: E };

export type SearchQueryResult =
  | { ok: true; query: string }
  | { ok: false; error: "SEARCH_QUERY_TOO_SHORT" };

export type VideoRequestResult =
  | { ok: true; videoId: string }
  | { ok: false; error: "INVALID_PAYLOAD" | "UNEXPECTED_FIELD" | "INVALID_VIDEO_ID" };

export type MusicQueueRequestResult =
  | {
      ok: true;
      videoId: string;
      title: string;
      channelTitle: string;
      thumbnailUrl: string | null;
    }
  | {
      ok: false;
      error:
        | "INVALID_PAYLOAD"
        | "UNEXPECTED_FIELD"
        | "INVALID_VIDEO_ID"
        | "INVALID_TITLE"
        | "INVALID_CHANNEL_TITLE"
        | "INVALID_THUMBNAIL_URL";
    };

export type YouTubeInsertErrorResult =
  | { ok: false; error: "VIDEO_ALREADY_IN_PLAYLIST" }
  | { ok: false; error: "YOUTUBE_INSERT_FAILED" };

export const YOUTUBE_POC_REDIRECT_URI = "http://localhost:3000/api/youtube/poc/oauth/callback";
export const YOUTUBE_POC_OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function parseSearchQuery(value: unknown): SearchQueryResult {
  const query = typeof value === "string" ? value.trim() : "";

  if (query.length < 3) {
    return { ok: false, error: "SEARCH_QUERY_TOO_SHORT" };
  }

  return { ok: true, query };
}

export function parseVideoRequestInput(value: unknown): VideoRequestResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const entries = Object.entries(value);
  if (entries.some(([key]) => key !== "videoId")) {
    return { ok: false, error: "UNEXPECTED_FIELD" };
  }

  const videoId = (value as { videoId?: unknown }).videoId;
  if (typeof videoId !== "string" || !VIDEO_ID_PATTERN.test(videoId)) {
    return { ok: false, error: "INVALID_VIDEO_ID" };
  }

  return { ok: true, videoId };
}

export function parseMusicQueueRequestInput(value: unknown): MusicQueueRequestResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const allowedFields = new Set(["videoId", "title", "channelTitle", "thumbnailUrl"]);
  if (Object.keys(value).some((key) => !allowedFields.has(key))) {
    return { ok: false, error: "UNEXPECTED_FIELD" };
  }

  const input = value as {
    videoId?: unknown;
    title?: unknown;
    channelTitle?: unknown;
    thumbnailUrl?: unknown;
  };

  if (typeof input.videoId !== "string" || !VIDEO_ID_PATTERN.test(input.videoId)) {
    return { ok: false, error: "INVALID_VIDEO_ID" };
  }

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) {
    return { ok: false, error: "INVALID_TITLE" };
  }

  const channelTitle = typeof input.channelTitle === "string" ? input.channelTitle.trim() : "";
  if (!channelTitle) {
    return { ok: false, error: "INVALID_CHANNEL_TITLE" };
  }

  const thumbnailUrl = typeof input.thumbnailUrl === "string" ? input.thumbnailUrl.trim() : "";
  if (thumbnailUrl) {
    try {
      const parsedUrl = new URL(thumbnailUrl);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return { ok: false, error: "INVALID_THUMBNAIL_URL" };
      }
    } catch {
      return { ok: false, error: "INVALID_THUMBNAIL_URL" };
    }
  }

  return {
    ok: true,
    videoId: input.videoId,
    title,
    channelTitle,
    thumbnailUrl: thumbnailUrl || null,
  };
}

export function mapYouTubeInsertError(value: unknown): YouTubeInsertErrorResult {
  const reasons = collectYouTubeErrorReasons(value);

  if (reasons.includes("videoAlreadyInPlaylist")) {
    return { ok: false, error: "VIDEO_ALREADY_IN_PLAYLIST" };
  }

  return { ok: false, error: "YOUTUBE_INSERT_FAILED" };
}

export function buildYouTubePocOAuthUrl(clientId: string) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", YOUTUBE_POC_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", YOUTUBE_POC_OAUTH_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return url.toString();
}

export function upsertEnvValue(content: string, key: string, value: string) {
  const assignment = `${key}=${value}`;
  const lines = content.split(/\r?\n/);
  const existingIndex = lines.findIndex((line) => line.trimStart().startsWith(`${key}=`));

  if (existingIndex >= 0) {
    lines[existingIndex] = assignment;
  } else {
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.splice(lines.length - 1, 0, assignment);
    } else {
      lines.push(assignment);
    }
  }

  return `${lines.join("\n").replace(/\n*$/, "")}\n`;
}

function collectYouTubeErrorReasons(value: unknown) {
  if (!value || typeof value !== "object") return [];

  const errors = (value as { error?: { errors?: Array<{ reason?: unknown }> } }).error?.errors;
  if (!Array.isArray(errors)) return [];

  return errors
    .map((error) => error.reason)
    .filter((reason): reason is string => typeof reason === "string");
}
