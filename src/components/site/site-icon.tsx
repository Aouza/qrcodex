const paths = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  calendar: "M8 2v5m8-5v5M3 10h18M7 14h2m3 0h2m3 0h.01M7 18h2m3 0h2M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
  play: "m8 4 12 8-12 8V4Z",
  clock: "M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  pin: "M12 22s8-8 8-14a8 8 0 1 0-16 0c0 6 8 14 8 14Zm3-14a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 10a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm.5-5.5h.01",
  music: "M16 5c-6-2-10-1-12 0m11 5c-4-2-8-2-10 0m9 5c-3-1-6-1-8 0M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
} as const;

export function SiteIcon({ name, size = 20 }: { name: keyof typeof paths; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}
