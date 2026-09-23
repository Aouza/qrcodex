import assert from "node:assert/strict";
import test from "node:test";
import { changePasswordSchema } from "../src/lib/validation/account-password.ts";

test("accepts a distinct password with at least 12 characters, letters and numbers", () => {
  const result = changePasswordSchema.safeParse({
    currentPassword: "PreviousPassword7",
    newPassword: "NewSecurePassword42",
    confirmPassword: "NewSecurePassword42",
  });

  assert.equal(result.success, true);
});

test("rejects weak passwords", () => {
  for (const newPassword of ["short7", "onlyletterslong", "123456789012"]) {
    const result = changePasswordSchema.safeParse({
      currentPassword: "PreviousPassword7",
      newPassword,
      confirmPassword: newPassword,
    });

    assert.equal(result.success, false);
    if (!result.success) assert.ok(result.error.flatten().fieldErrors.newPassword);
  }
});

test("rejects a mismatched confirmation and password reuse", () => {
  const mismatch = changePasswordSchema.safeParse({
    currentPassword: "PreviousPassword7",
    newPassword: "NewSecurePassword42",
    confirmPassword: "AnotherPassword42",
  });
  assert.equal(mismatch.success, false);
  if (!mismatch.success) assert.ok(mismatch.error.flatten().fieldErrors.confirmPassword);

  const reuse = changePasswordSchema.safeParse({
    currentPassword: "PreviousPassword7",
    newPassword: "PreviousPassword7",
    confirmPassword: "PreviousPassword7",
  });
  assert.equal(reuse.success, false);
  if (!reuse.success) assert.ok(reuse.error.flatten().fieldErrors.newPassword);
});
