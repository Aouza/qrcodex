import assert from "node:assert/strict";
import test from "node:test";
import { parseEventInput } from "../src/lib/validation/event.ts";

const base = { title: "Show de sexta", description: "", startsAt: "2026-10-02T22:00", endsAt: "", externalUrl: "", active: false };

test("accepts a minimal valid event", () => {
  const result = parseEventInput(base);
  assert.equal(result.success, true);
  assert.equal(result.data.title, "Show de sexta");
  assert.equal(result.data.description, null);
  assert.equal(result.data.ends_at, null);
  assert.equal(result.data.starts_at, "2026-10-03T01:00:00.000Z");
});

test("rejects a title that is too short", () => {
  assert.equal(parseEventInput({ ...base, title: "S" }).success, false);
});

test("rejects an invalid start date", () => {
  assert.equal(parseEventInput({ ...base, startsAt: "not-a-date" }).success, false);
});

test("rejects an end time before the start time", () => {
  const result = parseEventInput({ ...base, startsAt: "2026-10-02T22:00", endsAt: "2026-10-02T20:00" });
  assert.equal(result.success, false);
});

test("accepts an end time after the start time", () => {
  const result = parseEventInput({ ...base, startsAt: "2026-10-02T22:00", endsAt: "2026-10-03T02:00" });
  assert.equal(result.success, true);
  assert.ok(result.data.ends_at > result.data.starts_at);
});

test("rejects a non-HTTP(S) external URL", () => {
  assert.equal(parseEventInput({ ...base, externalUrl: "javascript:alert(1)" }).success, false);
});

test("accepts a valid HTTPS external URL", () => {
  const result = parseEventInput({ ...base, externalUrl: "https://example.test/evento" });
  assert.equal(result.success, true);
  assert.equal(result.data.external_url, "https://example.test/evento");
});

test("rejects February 31 instead of silently moving the event to March", () => {
  const result = parseEventInput({ ...base, startsAt: "2026-02-31T22:00" });
  assert.equal(result.success, false);
  assert.ok(result.error.issues.some(issue => issue.path[0] === "startsAt"));
});

test("rejects impossible days, months and clock values", () => {
  for (const startsAt of [
    "2026-02-29T22:00", "2024-02-30T22:00", "1900-02-29T22:00",
    "2026-04-31T22:00", "2026-00-10T22:00", "2026-13-10T22:00",
    "2026-10-00T22:00", "2026-10-32T22:00", "2026-10-02T24:00",
    "2026-10-02T25:00", "2026-10-02T23:60",
  ]) {
    const result = parseEventInput({ ...base, startsAt });
    assert.equal(result.success, false, `${startsAt} must be rejected`);
    assert.ok(result.error.issues.some(issue => issue.path[0] === "startsAt"));
  }
});

test("validates the optional end calendar independently of chronological order", () => {
  for (const endsAt of ["2026-02-31T22:00", "2026-02-29T22:00", "2026-04-31T22:00", "2026-10-02T24:00", "2026-10-02T23:60"]) {
    const result = parseEventInput({ ...base, startsAt: "2026-01-01T00:00", endsAt });
    assert.equal(result.success, false, `${endsAt} must be rejected as an end date`);
    assert.ok(result.error.issues.some(issue => issue.path[0] === "endsAt"));
  }
});

test("accepts leap days and month/year boundaries with unchanged UTC conversion", () => {
  for (const [startsAt, expected] of [
    ["2024-02-29T22:00", "2024-03-01T01:00:00.000Z"],
    ["2000-02-29T00:00", "2000-02-29T03:00:00.000Z"],
    ["2026-02-28T23:59", "2026-03-01T02:59:00.000Z"],
    ["2026-04-30T23:59", "2026-05-01T02:59:00.000Z"],
    ["2026-12-31T23:59", "2027-01-01T02:59:00.000Z"],
  ]) {
    const result = parseEventInput({ ...base, startsAt });
    assert.equal(result.success, true, `${startsAt} must be accepted`);
    assert.equal(result.data.starts_at, expected);
  }
});

test("preserves a next-day ending and permits an end equal to the start", () => {
  const overnight = parseEventInput({ ...base, endsAt: "2026-10-03T02:00" });
  assert.equal(overnight.success, true);
  assert.equal(overnight.data.ends_at, "2026-10-03T05:00:00.000Z");
  const sameInstant = parseEventInput({ ...base, endsAt: base.startsAt });
  assert.equal(sameInstant.success, true);
  assert.equal(sameInstant.data.ends_at, sameInstant.data.starts_at);
});
