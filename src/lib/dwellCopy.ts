import type { DwellPhase } from "./useDwellState";

/**
 * Single source of truth for the primary CTA copy across Hero,
 * MidPageCTA, and StickyMobileCTA. The copy escalates with the
 * visitor's commitment level so the same button "grows up" with them.
 *
 * Lengths are bounded so the copy fits even in the narrow mobile
 * sticky CTA without wrapping.
 */
export function getCtaCopy(phase: DwellPhase): string {
  switch (phase) {
    case "fresh":
      // Names the call the same way every other surface does ("שיחת התאמה").
      // The later phases deliberately don't name it — by then the visitor
      // knows what the button does, and the shorter copy fits the mobile bar.
      return "לתיאום שיחת התאמה, 20 דקות, בחינם";
    case "engaged":
      return "20 דקות. בלי לחץ למכור.";
    case "committed":
      return "אם הגעת עד כאן, בוא נדבר.";
    case "returning":
      return "שמחתי שחזרת. נקבע שיחה?";
  }
}
