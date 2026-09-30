/**
 * The COR-SYS mark and seal, from the cor-brand book («הנקודה»): four strokes
 * that align from right to left, the direction the page is read in, and end
 * in the copper point. The strokes take the surrounding text colour; the point
 * is always the signal copper.
 *
 * Both are decorative wherever the name is also written out in text, so they
 * are hidden from assistive tech. The seal's ring path needs a document-unique
 * id, passed in rather than generated: useId() differs between the prerender
 * (a client render) and hydration, and a mismatch would drop the landing page
 * back to a full re-render.
 */
const STROKES = [
  { cx: 56, a: -62 },
  { cx: 44, a: 34 },
  { cx: 32, a: -16 },
  { cx: 20, a: 0 },
] as const;

const Glyph = () => (
  <>
    <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
      {STROKES.map((s) => (
        <line
          key={s.cx}
          x1={s.cx - 4}
          y1={12}
          x2={s.cx + 4}
          y2={12}
          transform={s.a ? `rotate(${s.a} ${s.cx} 12)` : undefined}
        />
      ))}
    </g>
    <circle cx={7} cy={12} r={4.4} fill="hsl(var(--signal))" />
  </>
);

export const CorMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 24" className={className} aria-hidden="true" focusable="false">
    <Glyph />
  </svg>
);

export const CorSeal = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
    <defs>
      <path id={id} d="M60,11 a49,49 0 1,1 -0.01,0" />
    </defs>
    <g fill="none" stroke="currentColor">
      <circle cx={60} cy={60} r={57} strokeWidth={1.6} />
      <circle cx={60} cy={60} r={41} strokeWidth={0.8} />
    </g>
    {/* The page is RTL; left to inherit it, the ring text starts past the
        end of its path and does not render at all. */}
    <text
      direction="ltr"
      fontFamily="Heebo, sans-serif"
      fontSize={9.5}
      fontWeight={700}
      letterSpacing={2.2}
      fill="currentColor"
    >
      <textPath href={`#${id}`} textLength={296} lengthAdjust="spacing">
        COR-SYS · EREZ TAL-SHIR · 2026 ·
      </textPath>
    </text>
    <g transform="translate(26 48)">
      <Glyph />
    </g>
  </svg>
);
