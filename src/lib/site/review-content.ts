// Concept media and example endorsements must never become production facts.
export function isSiteReview() {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
}
