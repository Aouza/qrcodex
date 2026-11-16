# Relica's Rock Bar — Project documentation

This package is a **planning baseline** for Codex, not a claim that code or QRCodex integrations have been implemented. Start with `AGENTS.md`, then `docs/00-PRODUCT-SPEC.md`.

## Recommended workflow
1. Place these files at repository root, preserving `docs/` structure.
2. Ask Codex to read them and inspect the existing codebase.
3. Approve the integration ADR and implementation plan before code changes.
4. Implement incrementally with visual reviews and tests.

## Main design decision
Cinematic, dark, editorial, low-clutter homepage with a single torn-paper agenda section.

## Existing product dependency
QRCodex is the existing menu/agenda platform. Integration requires verification of its actual current code, schema and deployments. Do not duplicate it.
