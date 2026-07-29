# Scroll-driven conversion — layer inventory and backlog

Living document. The recurring audit loop reads the **Open** table, works the
top-ranked row, then moves it to **Settled** with the evidence that closed it.

**This is an inventory, not a proof.** No finite list can establish that no
further scroll layer exists — that is an open space, and a negative over it is
not provable. What this file does claim: every layer below was checked against
this codebase, and each carries a status backed by a measurement or a citation.
New layers get appended as they are found; that is the loop's job.

Last full sweep: 2026-07-29. Open table worked down from six rows to one.

---

## Implemented

| Layer | Where | Note |
|---|---|---|
| Entry reveal (fade + 12px rise, once) | `landing/Reveal.tsx` | `whileInView`, `once: true`, `-40px` margin. Used by 12 sections. |
| Staggered child reveal (60ms) | `Reveal.tsx` → `RevealStagger` | Parent/child variants. |
| Scroll progress bar | `landing/ScrollProgress.tsx` | Goal-gradient: visible advancement raises task persistence. |
| Scroll-depth analytics | `pages/Landing.tsx` | Fires at 25/50/75/100%. The measurement substrate everything else is judged on. |
| Scroll-triggered sticky CTA | `landing/StickyMobileCTA.tsx` | Appears past 0.3vh, hides near page bottom. Mobile only by design — desktop's persistent CTA is the fixed header (see Settled). |
| Mid-page CTA re-surfacing | `landing/MidPageCTA.tsx` | Catches the already-convinced before the page bottom. |
| Pinned scrub scrollytelling | `pages/About.tsx` + `about/NoiseToCoherence.tsx` | `position: sticky` container, `--p` written per frame via rAF, GPU transforms only. Kept off the landing page on purpose (see Settled). |
| Dwell-phase copy escalation | `lib/useDwellState.ts`, `lib/dwellCopy.ts` | Time-on-page, not scroll. Deliberately removed from the hero. |
| Dark/light band rhythm | `pages/Landing.tsx` | Section alternation as scroll structure. |
| One-shot entrance sequence | `landing/Hero.tsx` + `.cor-settle` | Noise → coherence, 1.22s, terminates. |
| Viewport-gated consent | `ConsentBanner.tsx` | `IntersectionObserver` on `#hero` so the banner never buries the primary CTA. |

## Deliberately rejected — do not "fix" these

| Layer | Why it stays out |
|---|---|
| Scrolljacking | NN/g usability testing finds it damages user control, discoverability, efficiency and task success. Also disorients screen-reader users. |
| Parallax | NN/g: same UX problems in the subtle form as the obvious form. Triggers vestibular symptoms. |
| Horizontal scroll section | Direction-ambiguous in RTL; poor keyboard and screen-reader behaviour. |
| Infinite scroll | Wrong genre — this is a single conversion page with a terminal form. |

---

## Open

Ranked by expected conversion effect over implementation cost.

| # | Layer | Status | Evidence / next step |
|---|---|---|---|
| 1 | `animation-timeline: view()` for `Reveal` | Deferred, not rejected | `ScrollProgress` is done (see Settled). `Reveal` is the other candidate — 12 sections, framer-motion `whileInView`. Unlike the progress bar it needs a real fallback path for the ~16% without support, and framer-motion owns the element's `transform`, so the two would fight. Wants a spike, not a patch. |

---

## Settled

| Layer | Decision | Evidence |
|---|---|---|
| Native scroll-driven `ScrollProgress` | **Implemented** | The bar set React state on every scroll event and animated `width`. Measured over one scripted 6000px scroll: **141 scroll events → 141 renders → 141 inline `width` writes**, each forcing layout. Rewritten to `transform: scaleX()` (compositor-only, `transform-origin: right` for RTL) driven by `animation-timeline: scroll(root block)` under `@supports`, with a rAF-coalesced ref write as fallback — neither path touches React state. Re-measured: **0 style writes**, and `scaleX` equals `scrollY / max` exactly at top, middle and bottom. Caught in testing: the global reduced-motion rule clamps `animation-duration` to 0.01ms, which on a scroll timeline pegs the bar at 100% so the indicator silently lies; restoring `animation-duration: auto` under that query fixes it, verified separately with `reducedMotion: 'reduce'`. |
| Scroll-direction awareness | **Rejected — no gap to close** | The proposal was to re-surface the CTA on upward scroll. There is no scroll position on either breakpoint where a CTA is absent (0/15 desktop, 0/22 mobile samples), so there is nothing to re-surface. The other form of the pattern — hiding the header on scroll-down, revealing on scroll-up — would remove the only persistent desktop CTA to solve a problem the site does not have, and NN/g's finding on scroll-coupled movement argues against making chrome move in response to scroll direction. |
| Count-up on the spec numbers | **Rejected — contradicts the register just chosen** | A number that animates on entry reads as marketing, and the hero was deliberately moved to an institutional register two commits earlier (third person, no urgency, no self-rewriting copy). The numbers are already the loudest element in the section at 20–24px inside a bordered grid; counting them up would argue for attention they have already won. The spec grid also *already* has an entrance (staggered `cor-settle`, 340–580ms) — a count-up would be a second animation on the same element. |
| Section read-progress / time remaining | **Rejected — wrong genre** | Read-progress affordances pay off on long-form articles, where the reader is deciding whether to invest in finishing. This is a pitch page terminating in a form: the useful signal is proximity to the CTA, which the global progress bar already carries. A per-section indicator would add furniture on a page already 11.9 viewports deep on desktop and 17.4 on mobile. |
| Pinned scrub on the landing page | **Rejected for this page — kept on `/about`** | The mechanism exists and works (`about-scene`), and `ProcessPreviewSection`'s four-session arc is the natural candidate. But pinning converts a section a visitor can skim in one screen into several screens of forced scrolling, on a page that is already 11.9 viewports on desktop and 17.4 on mobile. On an editorial page that trade buys comprehension; on a conversion page it buys distance between the visitor and the form. `/about` is where the technique earns its cost. Revisit only if scroll-depth analytics show visitors stalling at that section rather than passing through it. |
| Persistent CTA on desktop | **Rejected — the premise was false** | First pass claimed desktop had a 4,155px (4.6-viewport) stretch with no CTA, between the hero at y=499 and the mid-page CTA at y=4,654. That measurement queried `main` only, and so missed `SiteHeader` — which is `fixed inset-x-0 top-0 z-40` and carries a "בוא נדבר" `Link` to `/#diagnostic-form` (`trackCtaClick("header_diagnostic")`), on screen at every scroll position. Re-measured by sampling every 0.75 viewport with the consent banner dismissed and counting *any* visible form-routing control: **0 of 15 desktop samples and 0 of 22 mobile samples had no CTA in view.** Desktop already has a persistent CTA; `md:hidden` on `StickyMobileCTA` is deliberate, not an omission. Residual question below. |

---

## Not settleable here

Questions that need traffic, not a measurement. Parked until the site has
enough sessions to split.

| Question | Why it cannot be closed by inspection |
|---|---|
| Desktop: does a bottom bar beat the top-header CTA? | The Contentsquare figure (58M sessions, 400 retail sites, sticky bottom-bar CTAs +31% vs non-sticky) compares sticky against *nothing*, not against a sticky top-header CTA — which is what this site already has on desktop. Whether a second, bottom-anchored CTA adds conversions or just adds furniture is an A/B question. Do not implement on the strength of that number alone; it does not say what it would need to say. |

---

## Method note

The first item worked in this backlog was closed by discovering the measurement
behind it was wrong, not by building anything. Scope every DOM query to what a
visitor actually sees — the whole viewport, fixed elements included — not to a
convenient container. Sample across scroll depth rather than reasoning from a
static list of element positions.

---

## Sources

- NN/G, [Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- NN/G, [Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- Springer, [A Usability and Universal Design Investigation into Scrolljacking for Web Pages](https://link.springer.com/chapter/10.1007/978-3-032-16454-4_6)
- [Why parallax scrolling needs to die](https://www.fastcompany.com/90309395/why-parallax-scrolling-needs-to-die), Fast Company
- [Scrolling Designs: 8 Patterns and When to Use Each](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)
- [Scroll-Depth Tracking](https://vwo.com/blog/scroll-depth-tracking-what-why-and-how-of-monitoring-visitor-engagement/), VWO
- [Scroll depth and conversion rates](https://fastercapital.com/content/Website-Scroll-Depth--Scroll-Depth-and-Conversion-Rates--The-Impact-on-Business-Success.html), FasterCapital
