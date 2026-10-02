import { useId, useState } from "react";

/**
 * The full text of a long testimonial, under its verbatim pull quote.
 *
 * Replaced a <details> (2.10), which opened with a jump: the row grows from
 * 0fr to 1fr and the text fades in, the brand's one motion (`.ld-reveal` in
 * index.css). The text stays in the prerendered HTML for search; while closed
 * it is hidden from assistive tech, and it holds nothing focusable.
 */
const FullQuote = ({
  quote,
  more,
  less,
}: {
  quote: string;
  more: string;
  less: string;
}) => {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="ld-link mt-3 text-sm"
      >
        {open ? less : more}
      </button>
      <div
        id={id}
        className="ld-reveal"
        data-open={open ? "" : undefined}
        aria-hidden={!open}
      >
        <div>
          <p className="pt-3 leading-relaxed text-foreground">{quote}</p>
        </div>
      </div>
    </>
  );
};

export default FullQuote;
