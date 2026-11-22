# Employer screening review: "Od kogo zacząć?" (I1 + I2 test route)

## Intent

Employers say the Match Score alone does not tell them whom to call first or what to ask (opportunity O05). This change adds an employer-only test route that shows eight prepared applications for one Lead AI role in two modes:

- **A — "Sam wynik"**: score, answer, candidate note, materials (today's information).
- **B — "Wynik i wskazówki"**: the same, plus three sentences per application (I1: confirmed by an example / only declared / missing) and two suggested questions (I2).

The recruiter's task is the E2 protocol task: pick the three people to invite first and write one question for each. The route records each attempt locally so the session moderator can compare A and B.

The sentences and questions are **hand-written from the application text**. They simulate an AI output; no model runs. The screen says so.

## Acceptance criteria

1. Route `/#/app/kandydaci/przeglad` is available only to employer personas and is linked from the employer "Kandydaci" list.
2. A mode switch (two `aria-pressed` buttons) toggles A/B. Mode B uses the second letter set (D–K) and a different card order, as in the E2 materials.
3. Each card allows choosing the application as one of three first invitations (max three; the fourth choice is blocked with a visible message) and typing one question. In mode B, "Użyj pytania" copies a suggestion into the question field.
4. "Zapisz odpowiedź" requires exactly three picks, each with a question. It stores participant number, mode, picks, whether each question was taken verbatim, edited or own, and elapsed seconds, in a separate localStorage key validated with Zod. Product state is not touched.
5. Saved attempts are listed with a summary and can be exported as JSON and cleared after confirmation.
6. Decisions from the answer key are never displayed.
7. Poster People roles only: existing panel, Button, Checkbox, Textarea, MatchScore, BackLink, Notice. Works at 1280px, 390px and 320px without horizontal overflow; keyboard reachable.

## Validation

### Implemented

- `src/features/screening-review/` — fixture (`data.ts`), session/storage logic (`session.ts`), screen (`screening-review.tsx`), unit tests (`session.test.ts`).
- `src/app/screening-review.css` — route geometry composed from existing roles (24px white panels, ink contour, pink selection, light-pink fact, MatchScore, Notice). Selected mode button uses ink/white.
- Route in `app.tsx`, outline link "Od kogo zacząć? (test)" on the employer Kandydaci list, FEATURES.md EMP-11.

### Executed validation (2026-11-22, Windows, Node 24.19)

- `format:check`, `design-system:check` (67 files), `lint`, `typecheck`, `test` (34 passed, 7 new), `verify:packet`, `build` — all passed. Existing chunk-size warning remains.
- `test:e2e` **not run**: Playwright Chromium is not provisioned on this machine; not installed per AGENTS.md. No new Playwright journey was added.
- Manual walkthrough in the in-app browser as Karolina Wiśniewska: list link → route; mode A picks A, C, D; fourth pick blocked with message; own questions; save → "Zapisane próby (1)". Mode B: new letters/order, evidence and questions visible, "Użyj pytania" auto-picks H, D, F; edited H; save → stored sources `suggested, suggested, edited`. localStorage content checked.
- 320px width: no horizontal overflow (scrollWidth 320). Save bar is sticky only above 700px.
- Note: with global `core.autocrlf=true` the checkout gets CRLF and fails kit hashes and Prettier. Set `core.autocrlf=false` locally in this clone and re-checked out.

### Review pass

Diff limited to 3 tracked files (+21/−1) plus the new feature folder, CSS and this note. Kit untouched. Product state and schemas untouched. Known gaps: no keyboard-only walkthrough beyond native buttons/checkbox/textarea focus; no screen-reader test; score shown rounded to integers (E2 sheet uses one decimal).
