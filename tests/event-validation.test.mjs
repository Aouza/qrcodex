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
