import { NextResponse } from "next/server";
import { exchangeYouTubePocOAuthCode, YouTubePocOAuthBootstrapError } from "@/lib/youtube-poc/oauth-bootstrap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (error) {
    return htmlResponse("Authorization was not completed.", "Google returned an OAuth error. No token was saved.", 400);
  }

  if (!code) {
    return htmlResponse("Missing authorization code.", "No token was saved.", 400);
  }

  try {
    await exchangeYouTubePocOAuthCode(code);
    return htmlResponse(
      "YouTube POC authorization saved.",
      "YOUTUBE_REFRESH_TOKEN was written to .env.local. Restart the local dev server before testing the POC.",
    );
  } catch (caughtError) {
    const message = userFacingMessage(caughtError);
    return htmlResponse("YouTube POC authorization failed.", message, 500);
  }
}

function userFacingMessage(error: unknown) {
  if (error instanceof YouTubePocOAuthBootstrapError && error.code === "NO_REFRESH_TOKEN") {
    return "Google did not return a refresh token. Try opening the start URL again and confirm the consent prompt for this account.";
  }

  if (error instanceof YouTubePocOAuthBootstrapError && error.code === "ENV_WRITE_FAILED") {
    return "The token exchange worked, but the server could not write .env.local. No token is shown in the browser.";
  }

  return "No token was saved. Check local OAuth configuration and try again.";
}

function htmlResponse(title: string, message: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b0b0b; color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; }
      main { width: min(100% - 32px, 640px); }
      p { color: #b3b3b3; line-height: 1.5; }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
    </main>
  </body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
