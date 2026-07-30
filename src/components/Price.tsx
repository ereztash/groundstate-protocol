/**
 * A money amount, pinned to the ₪-prefix form regardless of the surrounding
 * paragraph direction.
 *
 * Without the bidi isolate in `.cor-price`, "₪1,900" renders as the prefix form
 * in a standalone numeric cell and with the sign trailing the digits once it is
 * dropped into a Hebrew sentence, so the same canonical string appeared two
 * different ways on the same page.
 *
 * Use this anywhere a price sits inside running text. A price alone in its own
 * element does not strictly need it, but using it everywhere keeps the two
 * cases from drifting again.
 */
const Price = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={`cor-price ${className}`}>{children}</span>;

export default Price;
