import assert from "node:assert/strict";
import test from "node:test";
import { PlaybackTerminal } from "../src/lib/youtube-poc/playback-terminal.ts";
const first = { id: "first", videoId: "aaaaaaaaaaa", title: "First", channelTitle: "Channel" };
const second = { ...first, id: "second", videoId: "bbbbbbbbbbb" };
const instruction = current => ({ current, topic: "opaque-topic" });

test("idle wake recovers playback; notifications and recovery ticks never interrupt playing", async () => {
  let calls = 0;
  const terminal = new PlaybackTerminal(async () => { calls++; return instruction(first); }, () => {});
  await terminal.wake();
  await terminal.wake();
  await terminal.recover();
  assert.equal(calls, 1);
  assert.equal(terminal.current.id, first.id);
});
test("ended/error follow server instructions, reject stale reports and finish waiting", async () => {
  const events = [];
  const replies = [first, second, null];
  const terminal = new PlaybackTerminal(async event => { events.push(event); return instruction(replies.shift()); }, () => {});
  await terminal.wake();
  await terminal.report({ operation: "ended", requestId: "wrong" });
  assert.equal(events.length, 1);
  await terminal.report({ operation: "ended", requestId: first.id });
  assert.equal(terminal.current.id, second.id);
  await terminal.report({ operation: "ended", requestId: first.id });
  assert.equal(events.length, 2);
  await terminal.report({ operation: "error", requestId: second.id, errorCode: 150 });
  assert.equal(terminal.state, "waiting");
  assert.equal(terminal.current, null);
});
test("network failure retries the same event rather than claiming or losing it", async () => {
  let failures = true;
  const events = [];
  const terminal = new PlaybackTerminal(async event => {
    events.push(event);
    if (event && failures) throw new Error("offline");
    return instruction(event ? second : first);
  }, () => {});
  await terminal.wake();
  const event = { operation: "ended", requestId: first.id };
  await terminal.report(event);
  assert.equal(terminal.state, "recovering");
  failures = false;
  await terminal.recover();
  assert.deepEqual(events.slice(1), [event, event]);
  assert.equal(terminal.current.id, second.id);
});
test("simultaneous wakes serialize; disposed or unauthorized terminals stop requests", async () => {
  let finish;
  let calls = 0;
  const terminal = new PlaybackTerminal(() => { calls++; return new Promise(resolve => { finish = resolve; }); }, () => {});
  const pending = terminal.wake();
  await terminal.wake();
  assert.equal(calls, 1);
  finish(instruction(null));
  await pending;
  terminal.dispose();
  await terminal.wake();
  assert.equal(calls, 1);
  const unauthorized = new PlaybackTerminal(async () => { throw new Error("PLAYER_UNAUTHORIZED"); }, () => {});
  await unauthorized.wake();
  assert.equal(unauthorized.state, "unauthorized");
  await unauthorized.recover();
});
