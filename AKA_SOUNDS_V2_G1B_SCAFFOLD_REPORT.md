# AKA SOUNDS V2 — G1B Scaffold Report

## Result

**G1B STATUS: PASS**

The isolated local scaffold and corrected Vercel Preview both validate successfully. The first deployment failed, was investigated, and was recovered without affecting Hostinger or the existing Vercel backend.

## Starting baseline

- Branch: `redesign/aka-sounds-v2`
- Starting HEAD: `23a94ae4530ca5b0471ec6ab223318b615cc2f1d`
- Upstream: `origin/redesign/aka-sounds-v2`
- Production `origin/main`: `f98a2a2bf41d13c1698d350ec70755932cddb0ad`
- Pre-V2 tag: `backup/aka-sounds-production-pre-v2-20260817` → `f98a2a2bf41d13c1698d350ec70755932cddb0ad`
- Working tree was clean before G1B.

## Governance amendment

The requested **Human Review Amendment — Gate Governance** was appended to `AKA_SOUNDS_V2_G1_ARCHITECTURE_PLAN.md`: G1A is approved, the MASTER PLAN remains authoritative, G2 is Commerce / Backend P0, G3 is Brand Foundation, visual design is outside G1B, and G1B is architecture scaffold only.

## Isolated V2 application

`v2/` is an independent Next.js App Router application with its own package manifest, lockfile, TypeScript, Next, PostCSS/Tailwind, ESLint, local ignore file, and neutral App Router harness.

Installed direct versions:

| Package | Version |
|---|---:|
| Next.js | 16.3.1 |
| React / React DOM | 19.2.8 |
| TypeScript | 6.0.3 |
| Tailwind CSS / `@tailwindcss/postcss` | 4.3.3 |
| ESLint | 9.39.5 |
| eslint-config-next | 16.3.1 |

TypeScript 6 and ESLint 9 were selected after npm peer compatibility validation with `eslint-config-next@16.3.1`; newer installed candidates were not mutually compatible.

### New V2 structure

```text
v2/
  app/ (all route contracts, layout, not-found, robots, sitemap)
  components/route-harness.tsx
  .env.example
  .gitignore
  eslint.config.mjs
  next.config.ts
  package.json / package-lock.json
  postcss.config.mjs
  tsconfig.json
```

The pages deliberately render only the neutral architecture harness: `AKA SOUNDS V2`, `G1B ROUTE SCAFFOLD`, and the requested route. No legacy UI, catalog, branding, audio, commerce, analytics, newsletter, Three/WebGL/WebGPU, or Lab implementation was ported.

## Route manifest and validation

Implemented contracts: `/`, `/sounds`, `/sounds/[slug]`, `/free`, `/free/[slug]`, `/tutorials`, `/tutorials/[slug]`, `/about`, `/deat-aka`, `/deat-aka/lab`, `/legal/privacy`, `/legal/terms`, `/legal/refunds`, 404, `robots.txt`, and `sitemap.xml`.

Dynamic routes expose only the non-production fixture slug `test`. Local HTTP validation passed for the 13 requested routes plus `/not-a-route` returning 404. `npm run build` passed and rendered all static/SSG route contracts; `npm run lint` passed.

The Lab route is static and declares its reservation for **G10B — DEAT AKA LAB**. No Lab dependencies or media are imported.

## Boundaries and reserved G2 locations

- `v2/.env.example` contains names only. Future server-only variables are visibly classified; the only public-safe placeholder is `NEXT_PUBLIC_SITE_URL`.
- No `app/api/subscribe` or `app/api/webhook` route exists. Both remain reserved for G2.
- The scaffold has no server integration, secret, provider SDK, or client-side provider configuration.

## Build, hygiene, and CodeGraph

| Check | Result |
|---|---|
| Legacy root build | PASS before scaffold work; V2 did not change root dependencies or source. |
| V2 build | PASS (`next build`) |
| V2 lint | PASS |
| Local route validation | PASS — 13 routes + 404 |
| V2 ignored paths | `v2/node_modules`, `v2/.next`, logs, `.env*` (except example), and `.vercel` are ignored |
| CodeGraph | Reindexed: 49 files, 272 nodes, 347 edges; legacy graph usable and V2 routes discoverable |
| `.codegraph/` | Remains untracked |

Next emits a non-fatal local warning because the repository intentionally has two lockfiles and it infers the root lockfile for Turbopack. The V2 build remains successful; resolving that warning without an approved V2-only configuration adjustment is deferred to human review.

## Isolated Vercel preview result and investigation

- New project: `aka-sounds-v2-preview`
- Root used for linking/deployment: `v2/`
- Existing AKA Sounds Vercel project: not modified
- Domains: none attached by this gate; `akasounds.com` and `www.akasounds.com` untouched
- Environment variables: none configured by this gate
- Paddle, MailerLite, Resend, GCS: not connected or configured
- First deployment ID: `dpl_46v1hqxs3Een8B2yykuqx16YFdjN`
- Deployment result: **ERROR** — historical first attempt
- Preview URL: unavailable for the historical failed attempt; do not use that failed URL

Root cause: the new project had `framework: null` and no explicit build/output settings. The remote Next build completed, but Vercel then applied static output handling and failed with `STATIC_BUILD_NO_OUT_DIR`: it looked for an output directory named `public`, which this Next App Router project does not produce. The failed deployment was classified as `target: production` inside the new isolated project; it did not touch Hostinger or the existing backend Vercel project. At that point no route checks were accepted and no retry or promotion had yet been attempted.

### Production-impact checks

HOSTINGER AKA SOUNDS MODIFIED: NO  
EXISTING VERCEL BACKEND MODIFIED: NO

## G1B-R — Vercel Preview Recovery

- First failure root cause: the new Vercel project had `framework: null`; after the Next build completed, Vercel applied static output handling and raised `STATIC_BUILD_NO_OUT_DIR` while looking for `public`.
- Fix: added `v2/vercel.json` with the Next.js framework declaration: `"framework": "nextjs"`.
- Successful deployment ID: `dpl_Dmzu1DpqMNGQTJz78sVxoYGXdkzM`
- Successful preview URL: `https://aka-sounds-v2-preview-d0uy7r7ac-rodriguezcami09-6937s-projects.vercel.app`
- Target: `preview`
- State: `READY`
- Route validation: **PASS** — requested static routes, dynamic fixtures, Lab, legal routes, and 404.
- HOSTINGER AKA SOUNDS MODIFIED: **NO**
- EXISTING VERCEL BACKEND MODIFIED: **NO**
- MAIN MODIFIED: **NO**

## Files changed outside `v2/`

1. `AKA_SOUNDS_V2_G1_ARCHITECTURE_PLAN.md` — required governance amendment only.
2. `AKA_SOUNDS_V2_G1B_SCAFFOLD_REPORT.md` — this report.

No existing production runtime file was modified: `src/**`, `api/webhook.ts`, `public/**`, `dist/**`, `.github/workflows/deploy.yml`, root dependencies, DNS, the existing Vercel project, Paddle, MailerLite, Resend, and GCS remain untouched. Hostinger and `akasounds.com` were not deployed to or changed.

## Final conclusion

G1B STATUS: PASS

SAFE FOR HUMAN G1B REVIEW

G2 and G3 were not started. No additional deployment was performed after the successful isolated preview recovery.
