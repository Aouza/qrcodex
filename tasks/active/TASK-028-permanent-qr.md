# TASK-028 — Generate permanent QR asset and printable test sheet

**Epic:** Establishment & Release
**Status:** READY
**Dependencies:** TASK-027

## Objective
Generate durable QR assets for the production menu URL and a printable validation sheet for real-device tests.

## Requirements
- Encode the permanent production menu URL `https://qrcodex-eight.vercel.app/relicas`.
- Generate a high-resolution raster asset and a scalable print asset.
- Create a simple A4 test sheet with the Relica's name, QR code and human-readable fallback URL.
- Keep sufficient quiet zone and contrast for reliable scanning.
- Do not add ordering, table identification or campaign tracking parameters.

## Acceptance criteria
- [ ] QR decodes exactly to the permanent production menu URL.
- [ ] Raster and scalable assets are committed in a documented public asset location.
- [ ] Printable A4 test sheet renders without clipping and includes the fallback URL.
- [ ] QR scans successfully from the rendered sheet on a physical or equivalent camera test.
- [ ] Relevant quality checks pass.

## Completion notes
Fill this section when implemented.
