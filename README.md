# groundstate-protocol

The marketing site for COR-SYS, Erez Tal-Shir's consulting practice. Hebrew,
right-to-left, statically rendered, deployed to GitHub Pages.

**Live:** https://ereztash.github.io/groundstate-protocol/

It began as a Lovable scaffold (hence `vite_react_shadcn_ts` in `package.json`)
and has since diverged substantially. What is worth reading here is not the
React. It is the set of CI guards that decide what the site is allowed to say.

---

## The part that is unusual

The site sells a consulting method whose premise is that a claim without a
source is worthless. That premise is enforced by the test suite rather than by
discipline.

Seven guard suites fail the build on specific strings. Three of them sweep every
file that can produce visible text: `refutedClaims` and `feminineAddress` over
`src/`, `content/`, `public/` and `index.html`, `noDashes` over the first two.
The rest check a particular dataset against its source. Each one quotes, in its
own code, the dated ledger row that refutes the claim it bans. They are not
style checks. They exist because each of these claims was on the site once and
was found to be unsupported.

| Guard | What fails the build |
|---|---|
| `src/lib/refutedClaims.test.ts` | Nine specific claims, among them a meeting count that was really the size of a research corpus, a value-to-fee multiplier, a superseded outreach count, and an unattributed revenue increase |
| `src/lib/feminineAddress.test.ts` | Masculine second-person address. Roughly 70% of clients are women, and Hebrew has no neutral second person, so "generic" masculine was a choice made against the majority of readers |
| `src/lib/noDashes.test.ts` | Em and en dashes in displayed copy |
| `src/data/cases.test.ts` | A case record in `src/data/cases/` that lacks consent |
| `src/lib/clients.test.ts` | A testimonial pull quote that is not verbatim from, and shorter than, the full quote the client gave |
| `src/data/faq.test.ts` | Structured data that disagrees with the rendered FAQ, advertises a guarantee that is not live, leaves a surfaced objection unanswered, or carries retracted framing |
| `e2e/case-intake.spec.ts` | Undecided material reaching `dist/`: unconsented case records, unapproved guarantee copy, operator review notes |

Two implementation notes, because both were learned the hard way:

- **`flattenJsx`** (`src/lib/copyScan.ts`). A claim split across two `<span>`s
  is invisible to a line-by-line scan, and the guard against "22 פגישות" passed
  against copy containing exactly that, in two elements. `refutedClaims` now
  falls back to a tag-stripped, whitespace-collapsed view of the whole file
  before it reports clean. The other two sweeps stay line-by-line on purpose: a
  dash is one character and a pronoun is one word, so neither can be split
  without being broken mid-word.
- **Markers are content, never field names.** The first draft of the bundle
  guard looked for `consent_state` and failed immediately, on the validator that
  reads the field. A marker like that fails forever and teaches whoever hits it
  to delete the test.

### The consent leak

The clearest illustration of why render-time gates are not enough.

`src/lib/caseChain.ts` globs `src/data/cases/*.json` eagerly, so Vite inlined
every record into the production bundle. One of them, `C1`, was marked
`consent_state: "pending"`. The component correctly refused to draw it. The
bundler does not draw anything, so the client's pricing problem, what was built
for them, and the fee were sitting in a public JavaScript file. The record's own
caveat said the domain had been generalised so the client would not be
identified in a small market, which is a statement that identification was a
live risk.

The fix was to make **location the first gate**: a record only lives in
`src/data/cases/` once consent is granted and source integrity is confirmed.
Everything else lives in `docs/cases/`, which no bundle reads. See
`src/data/cases/README.md`. The runtime gates stay exactly as they were; they
are the second line, not the only one.

### Evidence levels

The rule is that a displayed number carries a level and an `n`, or it does not
get displayed. See `src/lib/evidence.ts`. This one is a convention rather than a
guard: nothing fails the build over a missing tag, which is why the refuted
claims above needed banning by name after the fact.

| Level | Meaning |
|---|---|
| `anchored` | A ledger or CRM row exists |
| `operator` | Reported by the operator, not cross-checked |
| `pending` | Not measured |

A `pending` level is shown in full, never hidden. Hiding a caveat so the page
reads more smoothly is the exact defect the classification exists to prevent.

---

## Stack

Vite 5, React 18, TypeScript, Tailwind, shadcn/ui, framer-motion. Vitest for
unit tests, Playwright for end-to-end. CI runs bun; npm works locally.

### Static rendering

`scripts/prerender.mjs` boots the built app in headless Chromium, visits each
route, and writes `dist/<route>/index.html` with the rendered markup and
per-route `<head>` tags. Asset paths are rewritten per route depth, because a
page at `/insights/<slug>/` resolves a relative `./assets/index.js` against its
own directory.

Ten routes: `/`, `/protocol`, `/insights`, one page per article in
`content/insights/`, `/about`, `/privacy`. Article routes are discovered from
the filesystem, so adding a markdown file is enough. The one manual step is
adding the URL to `public/sitemap.xml`.

`src/hooks/useDocumentMeta.ts` is the runtime half of the same job, for
in-app navigation. It restores the previous tags on unmount, which matters more
than it sounds: a `noindex` that outlives its route lands on whatever the
visitor opens next, silently.

### Dev-only routes

`/case-intake` (capture a client case) and `/guarantee-review` (compare the
three guarantee options) are compiled out of production builds. Both are behind
one flag.

Pages is a static host with no request layer, so there is nowhere to check a
credential and nothing that can answer 401. Hiding a route in the UI leaves the
code one URL guess away. The only protection a static host can enforce is
absence: the chunk is not built, and the URL falls through to the 404 page.
`e2e/case-intake.spec.ts` asserts both halves, the navigation failure and the
absence from `dist/assets`.

Available in dev, or with `VITE_ENABLE_CASE_INTAKE=1` at build time, which is
for a host that can put a real credential in front of them. Not for Pages.

---

## Layout

```
content/insights/     Articles as markdown with frontmatter. Routing, the index
                      page and the prerender list all read from here.
docs/                 Not built. Strategy notes, the site audit, and case
                      records that are not cleared for publication.
e2e/                  Playwright: prerender output, bundle contents, smoke,
                      Core Web Vitals.
public/               Static assets, sitemap.xml, robots.txt, llms.txt.
scripts/              prerender.mjs and check-budget.mjs run in CI. The rest
                      are one-off tools: A/B power simulation, OG image
                      generation, a dash stripper.
src/components/       UI. landing/ holds the page sections, ui/ is shadcn.
src/data/             Content with structure: prices, FAQ, wizard questions and
                      the rule that reads them, guarantee variants, cases.
src/lib/              Logic and the guard tests.
src/pages/            Route components.
```

The split between `src/data` and `src/components` is deliberate: prices, copy
and decision rules live in `src/data` so the price ladder and the wizard cannot
disagree about what stage 3 costs, and so the parts with behaviour can be tested
without mounting React.

---

## Commands

```sh
npm install
npm run dev              # Vite dev server

npm run typecheck        # tsc over both projects, strict
npm run lint             # eslint
npm run test             # vitest, 161 unit tests
npm run build:ssg        # vite build + prerender to dist/
npm run check:budget     # transfer-size budget over dist/
npm run test:e2e         # playwright, 29 tests, needs dist/
```

`test:e2e` and `check:budget` both read `dist/`, so run `build:ssg` first.

### Performance budget

`scripts/check-budget.mjs` measures gzip transfer size against per-asset
ceilings. `limit` fails the build, `target` is reported and never enforced.

The initial payload, meaning everything `dist/index.html` references, is capped
at 152 kB with a target of 140. It currently sits at 148 kB. Lazy chunks are
capped at 46 kB each, the stylesheet at 15 kB.

---

## CI

Four jobs on every pull request (`.github/workflows/ci.yml`):

1. **Types.** `tsc --noEmit` over the app and node projects. Its own job so a
   lint failure does not hide the type result. Note that `vite build`
   transpiles through esbuild, which strips types without reading them, so
   nothing else in this pipeline would catch a type error.
2. **Lint.** eslint.
3. **Unit tests.** Vitest, which is where the content guards run.
4. **E2E.** Build, budget, then Playwright against the production bundle. This
   is the layer that catches a runtime crash a green build can still hide.

TypeScript runs at full strict, including `noUnusedLocals` and
`noUnusedParameters`. The latter two are on because `@typescript-eslint/no-unused-vars`
is explicitly off in this repo, so nothing else catches an unused variable.

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`.

---

## Environment

See `.env.example`. All are optional: each of the first four falls back to a
value baked into the source, so the site builds and runs without a `.env` at
all. That fallback is why an unset GitHub Actions secret, which injects an
empty string rather than nothing, is coalesced with `||` and not `??`. Without
it the form once posted to `fetch("")`, which resolved against the current page
and returned 405 from Pages.

| Variable | Purpose |
|---|---|
| `VITE_APPS_SCRIPT_URL` | Lead form endpoint (Google Apps Script) |
| `VITE_APPS_SCRIPT_SECRET` | Token the Apps Script checks before writing a row. A spam deterrent, not authentication: it ships in the client bundle by design |
| `VITE_GA_MEASUREMENT_ID` | GA4. Loads only after consent |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity. Same consent gate |
| `VITE_BASE_PATH` | Deploy base. `/groundstate-protocol/` for Pages; builds otherwise default to a relative base |
| `VITE_ENABLE_CASE_INTAKE` | `1` compiles the internal intake tool into a production build |

Analytics do not load until the visitor accepts the consent banner.

---

## Conventions

**Comments explain the decision, not the syntax.** Most non-obvious code here
carries a comment naming what went wrong before, often with the commit. This is
deliberate: the repo is maintained by one person plus whatever agent is helping
that week, and a rule whose reason is not written down gets deleted by the next
person who finds it inconvenient.

**A guard is not trusted until it has been seen to fail.** Every content guard
in this repo was falsified against the copy it claims to catch before it was
committed. A test that has only ever passed proves nothing about what it scans.

**Displayed copy addresses the reader in the feminine.** Enforced for pronouns
and for five imperatives that have no other reading. Verb agreement is left to
review, because in unvocalised Hebrew the second-person-masculine future is
homographic with the third-person-feminine future, and banning those forms would
flag every correct sentence about a third party.

**No em dashes** in `src/` or `content/`.

---

## Open decisions

Waiting on the operator, not on code:

- **Guarantee.** Three variants exist in `src/data/guaranteeVariants.ts`;
  `ACTIVE_VARIANT` has been `"none"` since 2026-07-30, and while it is none, no
  variant ships. Review them at `/guarantee-review` in dev.
- **Case C1.** Sitting in `docs/cases/`, awaiting the client's publication
  consent. Granting it turns on the evidence chain, which is the highest
  value-per-effort item in the repo.
- **Domain.** `ereztalshir.co.il` is not connected. Everything canonical points
  at the Pages sub-path. `index.html` carries the full migration checklist.
