# AKA SOUNDS V2 · GATE 0 — Freeze / Backup / Baseline

**Date:** 2026-08-17  
**Scope:** baseline only. No redesign, migration, deployment, merge, deletion, or production behavior change was performed.

## Result

**GATE 0 STATUS: BLOCKED**

The production baseline and current architecture are known, and the current build passed. However, the working tree is not clean and the repository is not on `main`; creating the requested Pre-V2 checkpoint/tag and `redesign/aka-sounds-v2` branch would be unsafe until the existing local work is deliberately classified, committed, stashed, or otherwise resolved by the human owner.

## Repository identity

| Item | Baseline |
|---|---|
| Local path | `C:\antigravity\aka-sounds` |
| Remote | `https://github.com/CristianRodrigue/aka-sounds-landing.git` |
| Remote match | PASS — `CristianRodrigue/aka-sounds-landing` |
| Current branch | `codex/security-paddle-vercel` |
| Current HEAD | `f98a2a2bf41d13c1698d350ec70755932cddb0ad` (`Retry deploy`) |
| Production baseline | `f98a2a2bf41d13c1698d350ec70755932cddb0ad` |
| Production evidence | latest Vercel production deployment is `READY`, from `main`, at the same SHA |
| Existing local backup tag | `backup/aka-sounds-security-20260817` |
| Requested V2 branch | `redesign/aka-sounds-v2` does not exist and was not created |

Vercel project confirmed read-only: `aka-sounds-landing` (`prj_BOGKUsWjVwPu8qIANyBpwKCKfUza`), Vite preset, root `.`, Node 24.x, build command `echo "Saltando build"`, output directory `public`.

## Git state at the end of G0

```text
Branch: codex/security-paddle-vercel
Modified: test-webhook.mjs
Untracked: .codegraph/
Untracked: AKA_SOUNDS_INFRASTRUCTURE_AUDIT.md
Untracked: AKA_SOUNDS_SECURITY_PADDLE_VERCEL_REPORT.md
```

`test-webhook.mjs` is the previous local security remediation that removes a hardcoded webhook secret; it was not changed by G0. The two existing reports were also preserved. `.codegraph/` was created because the human explicitly requested local CodeGraph initialization; its index is current (27 files, 188 nodes, 266 edges).

The Gate 0 build temporarily regenerated a tracked `dist/assets/index.css`; that generated-only difference was reverted immediately. No build artifact remains modified.

## Build state

| Check | Result |
|---|---|
| Dependency install | Not run — tracked `node_modules` is present, so installation was not needed |
| `npm run build` | PASS |
| TypeScript | PASS |
| Vite production build | PASS |
| Source/UI changes from build | None retained |

## Current architecture

### Application

- React + TypeScript + Vite + Tailwind 4 + Motion.
- Client-side `HashRouter`, with `/`, `/product/:slug`, `/legal/:page`, `/free-trial`, `/tutorials`, `/deat_aka`, and a not-found route.
- Current code is not Next.js and does not use the App Router.
- Main indexed UI files: `src/App.tsx`, seven pages, four shared components, product/free-pack data, analytics/cookie utilities, and audio player.
- The homepage currently loads a YouTube iframe background. This is recorded only as baseline architecture; no visual change was made.

### Server/integrations

| Area | Current baseline |
|---|---|
| Vercel API | `api/webhook.ts` only; no in-repo `/api/subscribe` endpoint |
| Paddle checkout | client-side Paddle initialization in `src/App.tsx` |
| Paddle fulfillment | `transaction.completed` webhook → Paddle customer lookup → Google Cloud signed URL → Resend email → MailerLite request |
| Product data | distributed across `src/data/products.ts`, `src/data/freePacks.ts`, and hardcoded webhook mappings |
| Newsletter | browser POST to Google Apps Script using `no-cors` |
| MailerLite | webhook writes a subscriber as `active` after fulfillment |
| Resend | transactional download email from webhook |
| Google Cloud Storage | signed download URL from webhook |
| Analytics | Google Analytics and Meta Pixel injected after cookie-banner flow |
| Deployment | GitHub Actions FTP workflow plus separately deployed Vercel webhook/API project |

## Environment variables

No values were read or printed. Source inspection found these names:

| Name | Baseline use |
|---|---|
| `PADDLE_API_KEY` | Required by webhook/Paddle server SDK |
| `PADDLE_WEBHOOK_SECRET` | Required for webhook signature verification |
| `RESEND_API_KEY` | Required for download email delivery |
| `MAILERLITE_API_KEY` | Used for subscriber request after fulfillment |
| `GCP_CLIENT_EMAIL` | Required for Google Cloud Storage client |
| `GCP_PRIVATE_KEY` | Required for Google Cloud Storage client |
| `GCP_BUCKET_NAME` | Required for storage bucket selection |
| `GCP_FILE_NAME` | Used for premium download mapping |
| `PADDLE_WEBHOOK_TEST_URL` | Test helper only |
| `PADDLE_WEBHOOK_TEST_EMAIL` | Test helper only |

The previous Paddle/Vercel security report recorded the production integration variables as encrypted Vercel environment variables. Their values remain uninspected in G0.

## Repository hygiene and size

| Finding | Evidence / impact |
|---|---|
| Git metadata size | `.git` is about 552.61 MiB; `git count-objects` reports 501.49 MiB loose objects and a 50.10 MiB pack |
| `node_modules` tracked | 7,606 tracked paths; current directory about 375.25 MiB |
| `dist` tracked | 23 tracked paths; current directory about 89.54 MiB |
| Duplicate large video | `public/0227.mp4` and `dist/0227.mp4` are each about 68.14 MiB |
| Ignored temporary data | `tmp` is about 330.84 MiB, including browser/Edge profile artifacts |
| README accuracy | README claims Next.js 15+, SSR, Docker and Nginx; the actual project is Vite/React and the Vercel project is configured as Vite |
| Generated files in Git | tracked `node_modules` and `dist` make normal installs/builds create noisy working-tree changes |

Nothing was removed in G0.

## Risks discovered for later gates

These are baseline findings only; they are not fixes and do not authorize G1/G2 work yet.

1. **Checkpoint safety:** current branch is not `main` and the working tree has unresolved modifications/untracked files. This blocks the requested Pre-V2 tag and V2 branch creation.
2. **Fulfillment mapping:** product/price/file data is duplicated; the webhook uses hardcoded mappings while frontend data has separate IDs. This is a G2 P0 concern.
3. **Unknown product behavior:** existing webhook logic needs controlled-error behavior rather than an implicit delivery fallback. This is a G2 P0 concern.
4. **Consent boundary:** webhook currently obtains marketing-consent data but MailerLite activation is not gated by that value. This is a G2 P0 concern.
5. **Newsletter certainty:** the current Google Apps Script `no-cors` flow cannot verify a successful subscription response. This is a G2 P0 concern.
6. **Webhook failure semantics:** existing webhook catch path returns HTTP 200 after internal failure. This is a G2 P0 concern.
7. **SEO/routing:** HashRouter prevents the target real URL architecture required for G1/G11.
8. **Repository hygiene:** tracking `node_modules`/`dist`, duplicated media, and stale README increase migration/build risk.
9. **Vercel build mismatch:** source build is Vite, while Vercel project build configuration skips the build and publishes `public`; this needs an explicit, later architecture decision.
10. **Automated coverage:** CodeGraph found no covering tests for key frontend/webhook paths.

## CodeGraph

CodeGraph was initialized locally at the human's request and is ready for the later migration work.

```text
Indexed files: 27
Nodes: 188
Edges: 266
Status: up to date
```

It established the current routing, component graph, API boundary, and dynamic links such as `Home → Newsletter` and `Product → Newsletter` without broad source scanning.

## Exact commands executed

```text
codegraph --help
codegraph init .
git branch --show-current; git rev-parse HEAD; git remote -v; git status --short --branch; git log -5 --oneline; git count-objects -vH; git ls-files -- 'node_modules/**' | Measure-Object | Select-Object -ExpandProperty Count; git ls-files -- 'dist/**' | Measure-Object | Select-Object -ExpandProperty Count
codegraph status .
codegraph explore "routing, Home, products, api/webhook, newsletter integration, analytics"
codegraph node src/App.tsx
codegraph node api/webhook.ts
codegraph node src/components/Newsletter.tsx
codegraph node src/data/products.ts
Get-Content -LiteralPath package.json -Raw
Get-Content -LiteralPath .gitignore -Raw
vercel list aka-sounds-landing --format json
npm run build
vercel project inspect aka-sounds-landing
codegraph files
codegraph explore "Paddle checkout flow and transaction.completed webhook fulfillment"
git diff -- dist/assets/index.css | git apply -R --whitespace=nowarn
git tag --list 'backup/*'
git branch --list 'redesign/aka-sounds-v2'
```

## Required human decision before G1

Resolve the existing working-tree state deliberately: decide how to preserve/commit the current `test-webhook.mjs` security remediation and the two existing audit reports, and whether `.codegraph/` should be committed or ignored. Once the tree is clean and `main` is checked out, G0 can safely create the Pre-V2 checkpoint and `redesign/aka-sounds-v2` branch.

**GATE 0 STATUS: BLOCKED**

**Blocking reasons:** not on `main`; modified `test-webhook.mjs`; existing untracked reports; and the newly requested local CodeGraph index is untracked.

STOP. Do not start GATE 1 until human review.

## G0A — Existing Security Work Preservation

### Security branch status

- Branch preserved: `codex/security-paddle-vercel`.
- Security commit: `1945732` (`security: preserve Paddle webhook remediation`).
- Remote backup: PASS — pushed to `origin/codex/security-paddle-vercel` with upstream tracking.
- No pull request was opened. `main` was not changed.

### Remediation preserved

`test-webhook.mjs` now reads the Paddle webhook secret, test URL, and optional test email from environment variables. It exits before network activity if the required test variables are absent. No Vercel variable was changed and no real transaction, customer, email, or production webhook request was made.

### Tests executed

| Check | Result |
|---|---|
| `node --check test-webhook.mjs` | PASS |
| Missing test secret/URL | PASS — exits before network activity |
| Valid synthetic Paddle HMAC | PASS |
| Invalid synthetic Paddle HMAC | PASS — rejected |
| `npm run build` | PASS — TypeScript and Vite build complete |
| Working-tree secret pattern scan | PASS — no hardcoded webhook/API/private-key pattern paths |

The HMAC test used test-only in-memory data and did not contact Paddle or Vercel.

### Reports classification

| Report | Classification | Recommended eventual location |
|---|---|---|
| `AKA_SOUNDS_INFRASTRUCTURE_AUDIT.md` | A — useful audit history | `docs/audits/` |
| `AKA_SOUNDS_SECURITY_PADDLE_VERCEL_REPORT.md` | A — useful security history | `docs/security/` |
| `AKA_SOUNDS_V2_GATE_0_REPORT.md` | A — V2 baseline / gate record | `docs/audits/` |

No report matched the secret patterns checked in G0A. They were preserved in place; no unrelated reorganization was performed.

### CodeGraph version-control decision

`.codegraph/.gitignore` defines the directory as machine-local generated data. The root `.gitignore` now contains `.codegraph/`; the local graph remains available but generated database, WAL/SHM, PID, log, and cache artifacts are excluded from Git.

### Remaining risks and next state

The G2 fulfillment, consent, mapping, newsletter, and Vercel build-configuration risks remain intentionally unresolved. They are not blockers for preserving this security branch, but they are not authorized fixes in G0A.

The local security work is committed and backed up remotely. It is safe to review G0A before continuing normal G0, but this does not authorize switching to `main`, creating `redesign/aka-sounds-v2`, starting G1, or deploying.

**G0A STATUS: PASS**

**SAFE TO REVIEW G0A BEFORE CONTINUING GATE 0**
