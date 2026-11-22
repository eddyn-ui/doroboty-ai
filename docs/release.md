# Release runbook (Vercel)

Owner: the project owner (repository eddyn-ui/doroboty-ai). She publishes, watches the first sessions and responds to problems. Contact for users: the person who shared the link.

The app is a static site. No server, database, environment variables or secrets. Data (including E2 attempts) lives only in each visitor's browser (localStorage).

## 1. Before a release

1. Work on `main`. Note the commit you release (`git log -1 --oneline`).
2. Run locally: `npm ci`, `npm run build`, `npm test`, `npm run lint`. All must pass. The Vite chunk-size warning is known and not a blocker.
3. Optional but recommended: `npm run preview` and walk the smoke test below on http://127.0.0.1:3001.

## 2. Publish on Vercel (first time)

1. Sign in to vercel.com with GitHub. Add New → Project → import `eddyn-ui/doroboty-ai`.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist`, install command `npm ci`.
3. Node.js version: 24.x (Settings → Build and Deployment → Node.js Version). Vercel's default is 26.x, which `package.json` engines (`>=24 <27`) also accept, but 24.x matches local checks.
4. No environment variables are needed. Do not add any.
5. Deploy. Every push to `main` creates a new production deployment; the deployment page shows the commit it was built from.

Hash routing (`/#/...`) and `base: "./"` mean no rewrites are required.

## 3. Smoke test right after publishing (about 5 minutes)

On the production URL, in a private window:

1. The address starts with `https://` and the home page shows the DoRoboty.ai illustration.
2. "Dla firm" → "Wejdź jako Karolina Wiśniewska" → Kandydaci → "Od kogo zacząć? (test)".
3. Pick three applications, use one suggested question each, "Zapisz odpowiedź" → "Zapisane próby (1)".
4. "Pobierz wyniki" downloads `doroboty-przeglad-aplikacji.json` with that attempt. Then "Wyczyść" the test attempt.
5. Browser console (F12) has no red errors.

Roll back (section 4) if the page is blank, shows "Coś poszło nie tak", or the attempt cannot be saved or downloaded.

## 4. Roll back to the previous version

- Vercel: project overview → Production Deployment tile → Instant Rollback → pick the deployment → Continue → Confirm Rollback. On the Hobby plan only the immediately previous deployment is available.
- Alternative: revert the bad commit on `main` and push; Vercel builds the reverted version.
- Data impact: none on the server. Attempts stay in visitors' browsers. Storage keys are versioned (`doroboty.screening-review.v1`, `doroboty.prototype.v1`); a release that changes their shape must bump the version and be tested against an export first.

Source: https://vercel.com/docs/instant-rollback (checked 2026-11-22).

## 5. When something breaks

1. Diagnose: open the production URL in a private window. Check the Vercel deployment build log and the browser console. The app shows "Coś poszło nie tak" instead of a blank page after a render error and logs only the error name and message.
2. Restore service: roll back (section 4). Then fix locally, run section 1 and publish again.
3. Recover E2 results: the only copy of an attempt is the visitor's browser and the downloaded JSON. After every E2 session ask the recruiter to click "Pobierz wyniki" and send the file before closing the browser; only then "Wyczyść". If a session's file is missing, ask the recruiter to reopen the same link in the same browser and download again.
4. Communicate: tell the course instructor or the recruiter what happened, whether their saved answers are safe, and when to retry.
