import { useSpotsLeft } from "@/lib/spots";

type SpotsLeftProps = { className?: string };

/**
 * Live scarcity line. Reads the remaining monthly spots from the Sheet
 * (via Apps Script) so the number is updated by editing one cell — no
 * deploy. Until the count loads, or if the fetch fails, it shows the
 * static policy line, so the visitor always sees something coherent.
 */
const SpotsLeft = ({ className = "" }: SpotsLeftProps) => {
  const spots = useSpotsLeft();

  let text: string;
  if (spots === null) {
    text = "אני לוקח עד 10 לקוחות בחודש.";
  } else if (spots <= 0) {
    text = "המקומות החודש נתפסו — השאירו פרטים ואשבץ אתכם למועד הפנוי הקרוב.";
  } else {
    text = `נותרו ${spots} מקומות החודש.`;
  }

  return (
    <p className={className} aria-live="polite">
      {text}
    </p>
  );
};

export default SpotsLeft;
