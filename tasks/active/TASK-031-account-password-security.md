# TASK-031 — Add authenticated password security

**Epic:** Authentication & Admin Shell
**Status:** BLOCKED
**Dependencies:** TASK-014, TASK-027

## Objective
Allow an authenticated administrator to replace an initial or compromised password securely without depending on email delivery.

## Blocker
Implementation is deployed and awaits the administrator's manual password-change and new-login acceptance test.

## Requirements
- Add a protected account page to the existing admin shell.
- Require the current password, a new password and confirmation of the new password.
- Require letters and numbers in application validation and at least 12 characters in both application validation and Supabase Auth configuration.
- Update the password through Supabase Auth without exposing credentials to logs or persistence.
- Revoke other refresh-token sessions after a successful change while preserving the current session.
- Keep public sign-up disabled and do not implement email recovery or invitations without production SMTP.

## Acceptance criteria
- [ ] Only an authenticated, authorized administrator can access the account page and submit the action.
- [ ] Invalid current passwords and weak/mismatched new passwords produce safe field-level feedback.
- [ ] A valid password change succeeds and the new password authenticates.
- [ ] Other sessions are revoked after a successful change.
- [ ] Password values are never logged, returned, or stored by the application.
- [ ] Responsive UI follows the admin design system.
- [ ] Relevant tests, lint, typecheck and build pass.

## Completion notes
Fill this section when implemented.
