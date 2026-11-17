import assert from "node:assert/strict";
import test from "node:test";
import { getSiteWeekRange } from "../src/lib/site/week-range.ts";

test("home week is Monday through Sunday in Sao Paulo, including UTC/local date differences", () => {
  const expected = { from: "2026-11-16T03:00:00.000Z", before: "2026-11-23T03:00:00.000Z" };
  assert.deepEqual(getSiteWeekRange(new Date("2026-11-17T12:00:00Z")), expected);
  assert.deepEqual(getSiteWeekRange(new Date("2026-11-23T02:59:59Z")), expected);
  assert.deepEqual(getSiteWeekRange(new Date("2026-11-23T03:00:00Z")), {
    from: "2026-11-23T03:00:00.000Z", before: "2026-11-30T03:00:00.000Z",
  });
});

test("home week crosses month and year without truncating the weekend", () => {
  assert.deepEqual(getSiteWeekRange(new Date("2027-01-01T12:00:00Z")), {
    from: "2026-12-28T03:00:00.000Z", before: "2027-01-04T03:00:00.000Z",
  });
});
