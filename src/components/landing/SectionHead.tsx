/**
 * Running head for a landing section: chapter number, label, and a hairline to
 * the edge of the column, the way a printed document marks its sections. The
 * numbers give the page an order the reader can feel without reading; they
 * are decorative, so assistive tech gets the label alone.
 */
const SectionHead = ({ n, label }: { n: string; label: string }) => (
  <p className="ld-head">
    <span className="ld-head__n" aria-hidden="true">
      {n}
    </span>
    <span className="ld-head__label">{label}</span>
    <span className="ld-head__rule" aria-hidden="true" />
  </p>
);

export default SectionHead;
