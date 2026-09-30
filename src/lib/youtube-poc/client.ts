import { mapYouTubeInsertError, parseSearchQuery } from "@/lib/youtube-poc/validation";

const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_PLAYLIST_ITEMS_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const SEARCH_RESULT_LIMIT = "5";

export type YouTubePocSearchResult = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
};

type YouTubePocConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  playlistId: string;
};

type TokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
};

type SearchResponse = {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
};

export class YouTubePocError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "MISSING_CONFIG"
      | "TOKEN_FAILED"
      | "SEARCH_FAILED"
      | "INSERT_FAILED"
      | "VIDEO_ALREADY_IN_PLAYLIST",
  ) {
    super(message);
  }
}

export async function searchYouTubePocVideos(query: string) {
  const parsedQuery = parseSearchQuery(query);
  if (!parsedQuery.ok) {
    return [];
  }

  const config = readYouTubePocConfig();
  const accessToken = await getAccessToken(config);
  const url = new URL(YOUTUBE_SEARCH_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", SEARCH_RESULT_LIMIT);
  url.searchParams.set("q", parsedQuery.query);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new YouTubePocError("YouTube search failed.", "SEARCH_FAILED");
  }

  const payload = (await response.json()) as SearchResponse;
  return (payload.items ?? []).flatMap((item): YouTubePocSearchResult[] => {
    const videoId = item.id?.videoId;
    const title = item.snippet?.title;
    const channelTitle = item.snippet?.channelTitle;

    if (!videoId || !title || !channelTitle) return [];

    return [{
      videoId,
      title,
      channelTitle,
      thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url ?? null,
    }];
  });
}

export async function insertYouTubePocPlaylistItem(videoId: string) {
  const config = readYouTubePocConfig();
  const accessToken = await getAccessToken(config);
  const url = new URL(YOUTUBE_PLAYLIST_ITEMS_URL);
  url.searchParams.set("part", "snippet");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      snippet: {
        playlistId: config.playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    }),
    cache: "no-store",
  });

  if (response.ok) {
    return { ok: true as const };
  }

  const payload = await readJsonSafely(response);
  const mapped = mapYouTubeInsertError(payload);
  if (mapped.error === "VIDEO_ALREADY_IN_PLAYLIST") {
    throw new YouTubePocError("Video already exists in playlist.", "VIDEO_ALREADY_IN_PLAYLIST");
  }

  throw new YouTubePocError("YouTube playlist insertion failed.", "INSERT_FAILED");
}

function readYouTubePocConfig(): YouTubePocConfig {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

  if (!clientId || !clientSecret || !refreshToken || !playlistId) {
    throw new YouTubePocError("YouTube POC configuration is missing.", "MISSING_CONFIG");
  }

  return { clientId, clientSecret, refreshToken, playlistId };
}

async function getAccessToken(config: YouTubePocConfig) {
  const response = await fetch(YOUTUBE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as TokenResponse;
  if (!response.ok || !payload.access_token) {
    throw new YouTubePocError("YouTube OAuth token refresh failed.", "TOKEN_FAILED");
  }

  return payload.access_token;
}

async function readJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
