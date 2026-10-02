import { useState } from "react";

/** Copies the phone number and says so, in place (sieve candidate, 2.10). */
const CopyNumber = ({
  value,
  label = "העתקה",
  done = "הועתק",
}: {
  value: string;
  label?: string;
  done?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard refused: the number stays visible to copy by hand */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="hidden rounded-sm border border-border px-2 md:inline-block py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? done : label}
    </button>
  );
};

export default CopyNumber;
