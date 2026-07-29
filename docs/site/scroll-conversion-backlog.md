# Scroll-driven conversion — layer inventory and backlog

Living document. The recurring audit loop reads the **Open** table, works the
top-ranked row, then moves it to **Settled** with the evidence that closed it.

**This is an inventory, not a proof.** No finite list can establish that no
further scroll layer exists — that is an open space, and a negative over it is
not provable. What this file does claim: every layer below was checked against
this codebase, and each carries a status backed by a measurement or a citation.
New layers get appended as they are found; that is the loop's job.

Last full sweep: 2026-07-29.

---

## Implemented

| Layer | Where | Note |
|---|---|---|
| Entry reveal (fade + 12px rise, once) | `landing/Reveal.tsx` | `whileInView`, `once: true`, `-40px` margin. Used by 12 sections. |
| Staggered child reveal (60ms) | `Reveal.tsx` → `RevealStagger` | Parent/child variants. |
| Scroll progress bar | `landing/ScrollProgress.tsx` | Goal-gradient: visible advancement raises task persistence. |
| Scroll-depth analytics | `pages/Landing.tsx` | Fires at 25/50/75/100%. The measurement substrate everything else is judged on. |
| Scroll-triggered sticky CTA | `landing/StickyMobileCTA.tsx` | Appears past 0.3vh, hides near page bottom. **Mobile only** — see Open. |
| Mid-page CTA re-surfacing | `landing/MidPageCTA.tsx` | Catches the already-convinced before the page bottom. |
| Pinned scrub scrollytelling | `pages/About.tsx` + `about/NoiseToCoherence.tsx` | `position: sticky` container, `--p` written per frame via rAF, GPU transforms only. **Not on the landing page.** |
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
| 1 | Scroll-direction awareness | Not implemented | Re-surface the CTA on upward scroll (the mobile analogue of exit intent, where no cursor exists to track). Needs a velocity/direction hook; risk of feeling twitchy — prototype before committing. |
| 2 | Native CSS scroll-driven animation (`animation-timeline: view()`) | Not implemented | Technique, not narrative: would move `Reveal` and `ScrollProgress` off JS scroll listeners onto the compositor. Check Safari support and the framer-motion interaction before touching. |
| 3 | Count-up on the spec numbers entering view | Not implemented | Cheap, but reads as marketing animation and the hero was just moved to an institutional register. Likely **reject** — record the reasoning rather than leaving it unexamined. |
| 4 | Section read-progress / time remaining | Not implemented | Weak fit: the page is a pitch, not an article. Probably reject. |
| 5 | Pinned scrub on the landing page | Not implemented | The mechanism exists on `/about`. Would suit `ProcessPreviewSection` (the 4-session arc). Weigh against LCP and scroll cost on a conversion page. |

---

## Settled

| Layer | Decision | Evidence |
|---|---|---|
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
