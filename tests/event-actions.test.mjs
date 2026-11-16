import assert from "node:assert/strict";
import test from "node:test";
import { registerHooks } from "node:module";

const sourceRoot = new URL("../src/", import.meta.url);
const stubs = new Map([
  ["next/cache", "export const revalidatePath = path => globalThis.eventActionTest.paths.push(path);"],
  ["next/navigation", "export const redirect = path => { throw Error('redirect:'+path); };"],
  ["@/lib/auth/get-admin-access", "export const getAdminAccess = async () => globalThis.eventActionTest.access;"],
  ["@/lib/supabase/server", "export const createClient = async () => globalThis.eventActionTest.client;"],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (stubs.has(specifier)) return { url: `data:text/javascript,${encodeURIComponent(stubs.get(specifier))}`, shortCircuit: true };
    if (specifier.startsWith("@/")) return nextResolve(new URL(`${specifier.slice(2)}.ts`, sourceRoot).href, context);
    return nextResolve(specifier, context);
  },
});
const { deleteEvent, updateEvent } = await import("../src/app/admin/(protected)/events/[id]/actions.ts");
const { uploadEventImage, removeEventImage } = await import("../src/app/admin/(protected)/events/[id]/image-actions.ts");

const tenant = "56000000-0000-4000-8000-000000000011";
const id = "56000000-0000-4000-8000-000000000021";
const other = "56000000-0000-4000-8000-000000000022";
const project = "https://project.supabase.co";
const oldPath = `${tenant}/${id}/old.webp`;
const imageUrl = path => `${project}/storage/v1/object/public/event-images/${path}`;
const idle = { status: "idle" };

function fixture(options = {}) {
  const state = {
    row: { id, establishment_id: tenant, image_url: imageUrl(oldPath), active: true, ...options.row },
    files: new Set([oldPath]), calls: [], paths: [], updates: 0, removals: 0,
    access: options.status ? { status: options.status } : { status: "authorized", establishment: { id: tenant, slug: "relicas" } },
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = project;
  class Query {
    kind = "read"; filters = []; returning = false;
    select() { if (this.kind !== "read") this.returning = true; return this; }
    update(payload) { this.kind = "update"; this.payload = payload; return this; }
    delete() { this.kind = "delete"; return this; }
    eq(field, value) { this.filters.push([field, value]); return this; }
    is(field, value) { this.filters.push([field, value]); return this; }
    async execute() {
      state.calls.push({ kind: this.kind, payload: this.payload, filters: this.filters });
      if (this.kind !== "read") {
        assert.ok(this.filters.some(([field, value]) => field === "establishment_id" && value === tenant));
        assert.ok(this.filters.some(([field, value]) => field === "id" && value === id));
      }
      if (this.kind === "update") {
        state.updates++;
        if (options.failUpdateAt?.includes(state.updates)) return { data: null, error: { message: "private DB failure" } };
        if (options.zeroUpdateAt?.includes(state.updates)) return { data: null, error: null };
      }
      if (this.kind === "delete" && options.failDelete) return { data: null, error: { message: "private delete failure" } };
      if (this.kind === "delete" && options.zeroDelete) return { data: null, error: null };
      if (!state.row || this.filters.some(([field, value]) => state.row[field] !== value)) return { data: null, error: null };
      if (this.kind === "read") return { data: { ...state.row }, error: null };
      if (this.kind === "update") Object.assign(state.row, this.payload);
      if (this.kind === "update" && options.errorAfterUpdateAt?.includes(state.updates)) return { data: null, error: { message: "response lost after commit" } };
      if (this.kind === "delete") state.row = null;
      return { data: this.returning ? { id } : null, error: null };
    }
    maybeSingle() { return this.execute(); }
    then(resolve, reject) { return this.execute().then(resolve, reject); }
  }
  const bucket = {
    async upload(path) { state.calls.push({ kind: "upload", path }); state.files.add(path); return { error: null }; },
    getPublicUrl(path) { return { data: { publicUrl: imageUrl(path) } }; },
    async remove(paths) {
      state.removals++;
      state.calls.push({ kind: "remove", paths });
      assert.ok(state.row, "Storage ownership requires the event row to remain present");
      if (options.failRemoveAt?.includes(state.removals)) return { error: { message: "private storage failure" } };
      for (const path of paths) state.files.delete(path);
      return { error: null };
    },
  };
  state.client = { from: () => new Query(), storage: { from: name => { assert.equal(name, "event-images"); return bucket; } } };
  globalThis.eventActionTest = state;
  return state;
}

function uploadForm() {
  const form = new FormData();
  form.set("image", new File(["flyer"], "new.webp", { type: "image/webp" }));
  return form;
}

test("failed event DELETE after successful Storage removal cannot leave a published broken flyer", async () => {
  const state = fixture({ failDelete: true });
  const result = await deleteEvent(id, {});
  assert.ok(result.error);
  assert.equal(state.files.has(oldPath), false);
  assert.equal(state.row.active, false);
  assert.equal(state.row.image_url, null);
  assert.ok(state.paths.includes("/relicas/agenda"));
});

test("event deletion preserves the row through Storage cleanup and redirects only after confirmed deletion", async () => {
  const state = fixture();
  await assert.rejects(deleteEvent(id, {}), { message: "redirect:/admin/events?deleted=1" });
  assert.equal(state.row, null);
  assert.equal(state.files.size, 0);
});

test("zero-row DELETE reports incomplete deletion without republishing", async () => {
  const state = fixture({ zeroDelete: true });
  assert.ok((await deleteEvent(id, {})).error);
  assert.equal(state.row.active, false);
  assert.equal(state.row.image_url, null);
});

test("zero-row compensation cannot claim that the previous reference was restored", async () => {
  const state = fixture({ failRemoveAt: [1], zeroUpdateAt: [2] });
  const result = await removeEventImage(id, idle);
  assert.equal(result.status, "error");
  assert.equal(state.row.active, false);
  assert.equal(state.row.image_url, null);
  assert.match(result.message, /revisão/);
});

test("zero-row preparation prevents Storage removal and false success", async () => {
  for (const action of [deleteEvent, removeEventImage]) {
    const state = fixture({ zeroUpdateAt: [1] });
    const result = await action(id, idle);
    assert.ok(result.error || result.status === "error");
    assert.equal(state.removals, 0);
    assert.equal(state.row.active, true);
    assert.equal(state.files.has(oldPath), true);
  }
});

test("failed Storage removal restores a reference only as draft, never republishes", async () => {
  for (const action of [deleteEvent, removeEventImage]) {
    const state = fixture({ failRemoveAt: [1] });
    const result = await action(id, idle);
    assert.ok(result.error || result.status === "error");
    assert.equal(state.row.active, false);
    assert.equal(state.row.image_url, imageUrl(oldPath));
    assert.equal(state.files.has(oldPath), true);
    assert.ok(state.paths.includes("/relicas/agenda"));
  }
});

test("failed compensation remains an unpublished recoverable draft and returns an error", async () => {
  for (const action of [deleteEvent, removeEventImage]) {
    const state = fixture({ failRemoveAt: [1], failUpdateAt: [2] });
    const result = await action(id, idle);
    assert.ok(result.error || result.status === "error");
    assert.equal(state.row.active, false);
    assert.equal(state.row.image_url, null);
    assert.equal(state.files.has(oldPath), true);
  }
});

test("successful flyer removal unpublishes and clears the reference", async () => {
  const state = fixture();
  const result = await removeEventImage(id, idle);
  assert.equal(result.status, "success");
  assert.equal(state.row.active, false);
  assert.equal(state.row.image_url, null);
  assert.equal(state.files.size, 0);
});

test("successful replacement keeps the new linked flyer and removes only the old version", async () => {
  const state = fixture();
  const result = await uploadEventImage(id, idle, uploadForm());
  assert.equal(result.status, "success");
  assert.equal(state.files.size, 1);
  assert.equal(state.files.has(oldPath), false);
  assert.equal(state.files.has(state.row.image_url.split("/event-images/")[1]), true);
  assert.equal(state.row.active, true);
});

test("an uncertain draft write preserves physical media and invalidates public consumers", async () => {
  const state = fixture({ errorAfterUpdateAt: [1] });
  assert.ok((await deleteEvent(id, {})).error);
  assert.equal(state.removals, 0);
  assert.equal(state.files.has(oldPath), true);
  assert.equal(state.row.active, false);
  assert.ok(state.paths.includes("/relicas"));
});

test("replacement retains the valid new flyer when old cleanup fails instead of risking a failed rollback", async () => {
  const state = fixture({ failRemoveAt: [1], failUpdateAt: [2] });
  const result = await uploadEventImage(id, idle, uploadForm());
  assert.equal(result.status, "error");
  assert.notEqual(state.row.image_url, imageUrl(oldPath));
  const currentPath = state.row.image_url.split("/event-images/")[1];
  assert.equal(state.files.has(currentPath), true);
  assert.equal(state.row.active, true);
  assert.equal(state.updates, 1, "No speculative pointer rollback after committing a valid new image");
  assert.ok(state.paths.includes("/relicas/agenda"));
});

test("unlinked upload cleanup failure reports incomplete recovery without deleting the previous flyer", async () => {
  const state = fixture({ zeroUpdateAt: [1], failRemoveAt: [1] });
  const result = await uploadEventImage(id, idle, uploadForm());
  assert.equal(result.status, "error");
  assert.equal(state.row.image_url, imageUrl(oldPath));
  assert.equal(state.files.has(oldPath), true);
  assert.equal(state.files.size, 2);
  assert.doesNotMatch(result.message, /private/);
});

test("an uncertain link UPDATE cannot delete the flyer that was committed before its response failed", async () => {
  const state = fixture({ errorAfterUpdateAt: [1] });
  const result = await uploadEventImage(id, idle, uploadForm());
  assert.equal(result.status, "error");
  const path = state.row.image_url.split("/event-images/")[1];
  assert.notEqual(path, oldPath);
  assert.equal(state.files.has(path), true);
  assert.equal(state.removals, 0);
  assert.ok(state.paths.includes("/relicas/agenda"));
});

test("zero-row image linking does not report success and cleans its unlinked upload", async () => {
  const state = fixture({ zeroUpdateAt: [1] });
  const result = await uploadEventImage(id, idle, uploadForm());
  assert.equal(result.status, "error");
  assert.equal(state.files.size, 1);
  assert.equal(state.row.image_url, imageUrl(oldPath));
});

test("foreign event IDs and expired sessions cannot mutate or reach Storage", async () => {
  for (const status of ["unauthenticated", "not_configured", "selection_required", null]) {
    const state = fixture({ status });
    const eventId = status ? id : other;
    for (const result of [await deleteEvent(eventId, {}), await removeEventImage(eventId, idle), await uploadEventImage(eventId, idle, uploadForm())]) {
      assert.ok(result.error || result.status === "error");
    }
    assert.ok(state.calls.every(call => call.kind === "read"));
  }
});

test("an event owned by another tenant cannot be changed even with a matching resource ID", async () => {
  const state = fixture({ row: { establishment_id: "other-tenant" } });
  assert.ok((await deleteEvent(id, {})).error);
  assert.equal((await removeEventImage(id, idle)).status, "error");
  assert.equal((await uploadEventImage(id, idle, uploadForm())).status, "error");
  assert.ok(state.calls.every(call => call.kind === "read"));
});

test("deleting an owned event never deletes a flyer belonging to a different resource", async () => {
  const foreignPath = `${tenant}/${other}/foreign.webp`;
  const state = fixture({ row: { image_url: imageUrl(foreignPath) } });
  state.files.add(foreignPath);
  await assert.rejects(deleteEvent(id, {}), { message: "redirect:/admin/events?deleted=1" });
  assert.equal(state.files.has(foreignPath), true);
});

test("event editing detects a zero-row write instead of redirecting as success", async () => {
  fixture({ zeroUpdateAt: [1] });
  const form = new FormData();
  for (const [key, value] of Object.entries({ title: "Show", description: "", startsAt: "2026-10-02T22:00", endsAt: "", externalUrl: "" })) form.set(key, value);
  assert.ok((await updateEvent(id, {}, form)).formError);
});
