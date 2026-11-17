const localDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
});

export function getSiteWeekRange(now: Date) {
  const parts = localDate.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(value => value.type === type)?.value);
  const monday = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const nextMonday = new Date(monday);
  nextMonday.setUTCDate(nextMonday.getUTCDate() + 7);
  // Same -03:00 civil-time contract used by the existing Agenda forms.
  const midnight = (date: Date) => new Date(`${date.toISOString().slice(0, 10)}T00:00:00-03:00`).toISOString();
  return { from: midnight(monday), before: midnight(nextMonday) };
}
