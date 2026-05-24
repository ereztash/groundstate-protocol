import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trackEvent } from "@/lib/analytics";

type FootnoteProps = {
  number: number;
  tip: ReactNode;
  children: ReactNode;
};

/**
 * Renders inline text followed by a small superscript reference
 * marker. The marker reveals a tooltip with elaborating context on
 * hover / focus. Borrows the visual language of editorial footnotes
 * (Tufte, Gwern) without forcing a full sidenote layout — for a
 * landing page, the goal is to *signal* depth, not deliver an essay.
 *
 * Numbering is manual: pass `number` per call. Three or four total
 * across the whole page is the right ceiling; more turns into noise.
 *
 * Emits `footnote_open` whenever the tooltip transitions to the open
 * state, so analytics can answer "is anyone actually reading these?"
 */
export const Footnote = ({ number, tip, children }: FootnoteProps) => {
  const handleOpenChange = (open: boolean) => {
    if (open) {
      trackEvent("footnote_open", { footnote_number: number });
    }
  };

  return (
    <>
      {children}
      <Tooltip onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`הערה ${number} — פתח להסבר`}
            className="ms-0.5 inline-block align-super rounded text-[0.65em] font-bold text-primary/85 transition-colors hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {number}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="max-w-xs bg-foreground text-xs leading-relaxed text-background"
        >
          {tip}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
