# TASK-028 — Generate permanent QR asset and printable test sheet

**Epic:** Establishment & Release
**Status:** BLOCKED
**Dependencies:** TASK-027

## Objective
Generate durable QR assets for the verified canonical institutional homepage URL and a printable validation sheet for real-device tests (ADR-020). Preserve existing menu/Hub QR destinations.

## Blocker
Paused by product decision until the definitive custom domain is configured and validated. The current Vercel URL is provisional and must not be printed as the permanent QR destination.

## Requirements
- Encode the verified canonical institutional homepage URL. Do not encode the provisional Vercel URL as a permanent asset. Confirm the actual domain; `relicas.com.br` is the historical proposal, not proof of ownership/DNS.
- Generate a high-resolution raster asset and a scalable print asset.
- Create a simple A4 test sheet with the Relica's name, QR code and human-readable fallback URL.
- Keep sufficient quiet zone and contrast for reliable scanning.
- Do not add ordering, table identification or campaign tracking parameters.

## Acceptance criteria
- [ ] QR decodes exactly to the verified canonical institutional homepage URL.
- [ ] Inventory of existing printed/shared destinations is recorded and compatibility verified.
- [ ] Raster and scalable assets are committed in a documented public asset location.
- [ ] Printable A4 test sheet renders without clipping and includes the fallback URL.
- [ ] QR scans successfully from the rendered sheet on a physical or equivalent camera test.
- [ ] Relevant quality checks pass.

## Completion notes
Fill this section when implemented.
