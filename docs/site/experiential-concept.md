# COR-SYS — Experiential Concept: "קוהרנטיות" (Vector Alignment)

**Status:** proposed direction for the 3D / experiential build.
**Grounding:** derived from the COR-SYS knowledge-graph brief (2026-07-22), not invented.

## Why not "Ground State"

The term *Ground State / מצב יסוד* returns **zero** hits in the knowledge graph. Building
the visual identity on it would be inventing brand truth. We use the graph's own central
metaphor instead.

## The concept: alignment lowers the energy needed to move

The graph's load-bearing metaphor is **coherence (the "SYS" in COR-SYS)**:

> «המתודה מיישרת ארבעה וקטורים — זהות, ערך, מוצר, מכירה — לכיוון אחד. כשהם מיושרים,
> האנרגיה הנדרשת לתנועה קטנה.» (עקרון קוהרנטיות)

and the promised end-state:

> «מערכת שרצה בלעדיך.»

This is inherently dimensional. The visual system is: **scattered vectors resolving into
alignment.** Before = many forces pulling in different directions (the client's pain: eight
worlds, no through-line). After = one spine, low-energy flow. The animation is not decoration
— it *is* a demonstration of the product (the medium is the message).

## How it maps to the build

| Layer | Expression |
|---|---|
| **Hero motion (Tier 1)** | Vectors animate from scattered angles into a single parallel spine. Teal = the structure vectors; one **copper** vector = the aligned direction (action). Reuses the palette's discipline: copper only ever means "the chosen direction / action". |
| **Depth** | Layered shadows + `perspective`; the spine sits on a soft radial (`bg-radial-soft`). No WebGL required for the core feel. |
| **Scroll storytelling** | Each of the 4 stages reveals in sequence (chapters), reinforcing "fixed order, each builds the next". |
| **Optional Tier 2** | A single scoped WebGL moment (copper vector-field responding to pointer) — lazy-loaded, static fallback, `prefers-reduced-motion` off. Deferred until the Tier-1 spine is approved. |

## Non-negotiable constraints (held in every component)

- `prefers-reduced-motion` → render the final aligned state statically, no animation.
- Decorative motion is `aria-hidden`; all meaning also lives in real DOM text.
- Motion hydrates **after** the static content paints (protects LCP).
- Copper (`--accent`) is reserved for action / the aligned direction — never diluted.

## What this concept is NOT (from the graph)

> «ללא פנים, ללא צילום-מלאי, טקסט מוטמע מינימלי.» (פיילוט-מטא)

Not face-led, not stock-photography, not text-heavy, not flashy-agency. Quiet, structural,
editorial — depth in service of trust, not spectacle.
