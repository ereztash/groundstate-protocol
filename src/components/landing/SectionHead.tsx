/**
 * Running head for a landing section: chapter number, label, and a hairline to
 * the edge of the column that ends in the brand's copper point, the way a
 * printed document marks its sections and a signed one closes them. The
 * numbers give the page an order the reader can feel without reading; they
 * and the point are decorative, so assistive tech gets the label alone.
 */
const SectionHead = ({ n, label }: { n: string; label: string }) => (
  <p className="ld-head">
    <span className="ld-head__n" aria-hidden="true">
      {n}
    </span>
    <span className="ld-head__label">{label}</span>
    <span className="ld-head__rule" aria-hidden="true" />
    <span className="ld-head__point" aria-hidden="true" />
  </p>
);

export default SectionHead;
