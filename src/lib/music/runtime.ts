import "server-only";
export function productionMusicEnabled() { return process.env.MUSIC_PRODUCTION_ENABLED === "true"; }
export function localPocAllowed() {
  return process.env.NODE_ENV === "development" && !process.env.VERCEL && !productionMusicEnabled();
}
