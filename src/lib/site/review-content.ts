// Only the review notice depends on environment; approved content renders everywhere.
export function isSiteReview() {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
}
