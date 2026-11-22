# Production readiness fixes before the first Vercel release

## Intent

The readiness audit (docs/production-readiness.html, 2026-11-22) found three code risks and missing release documentation before publishing the static prototype on Vercel.

## Acceptance criteria

1. Saving an E2 attempt appends to the attempts currently in localStorage, so a second open tab cannot overwrite attempts saved elsewhere. Unit test covers it.
2. "Pobierz wyniki" keeps the object URL alive after the click so the download is not cancelled in Safari/Firefox.
3. An unexpected render error shows a Polish message with a reload button instead of a blank page; the console log contains only the error name and message.
4. docs/release.md describes publishing, smoke test, rollback and recovery on Vercel.

## Changes

- src/features/screening-review/session.ts: `appendAttempt`; session.test.ts: two tests.
- src/features/screening-review/screening-review.tsx: uses `appendAttempt`; deferred `revokeObjectURL`.
- src/features/prototype/error-boundary.tsx, src/main.tsx: root error boundary.
- docs/release.md; FEATURES.md EMP-11 and SYS-11 updated.
