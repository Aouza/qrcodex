import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  buildYouTubePocOAuthUrl,
  upsertEnvValue,
  YOUTUBE_POC_REDIRECT_URI,
} from "@/lib/youtube-poc/validation";

const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ENV_LOCAL_PATH = join(process.cwd(), ".env.local");

type OAuthTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export class YouTubePocOAuthBootstrapError extends Error {
  constructor(
    message: string,
    public readonly code: "MISSING_CONFIG" | "TOKEN_EXCHANGE_FAILED" | "NO_REFRESH_TOKEN" | "ENV_WRITE_FAILED",
  ) {
    super(message);
  }
}

export function getYouTubePocOAuthStartUrl() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  if (!clientId) {
    throw new YouTubePocOAuthBootstrapError("Missing YOUTUBE_CLIENT_ID.", "MISSING_CONFIG");
  }

  return buildYouTubePocOAuthUrl(clientId);
}

export async function exchangeYouTubePocOAuthCode(code: string) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new YouTubePocOAuthBootstrapError("Missing YouTube OAuth client configuration.", "MISSING_CONFIG");
  }

  const response = await fetch(YOUTUBE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: YOUTUBE_POC_REDIRECT_URI,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as OAuthTokenResponse;
  if (!response.ok) {
    throw new YouTubePocOAuthBootstrapError("YouTube OAuth token exchange failed.", "TOKEN_EXCHANGE_FAILED");
  }

  if (!payload.refresh_token) {
    throw new YouTubePocOAuthBootstrapError("OAuth response did not include a refresh token.", "NO_REFRESH_TOKEN");
  }

  await writeRefreshTokenToEnvLocal(payload.refresh_token);
}

async function writeRefreshTokenToEnvLocal(refreshToken: string) {
  try {
    const existingContent = await readEnvLocal();
    await writeFile(ENV_LOCAL_PATH, upsertEnvValue(existingContent, "YOUTUBE_REFRESH_TOKEN", refreshToken), "utf8");
  } catch {
    throw new YouTubePocOAuthBootstrapError("Could not write refresh token to .env.local.", "ENV_WRITE_FAILED");
  }
}

async function readEnvLocal() {
  try {
    return await readFile(ENV_LOCAL_PATH, "utf8");
  } catch {
    return "";
  }
}
