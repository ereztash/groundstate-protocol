import type { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trackEvent } from "@/lib/analytics";

type FootnoteProps = {
  number: number;
  tip: ReactNode;
  children: ReactNode;
};

/**
 * Renders inline text followed by a small superscript reference marker. The
 * marker reveals elaborating context. Borrows the visual language of editorial
 * footnotes (Tufte, Gwern) without a full sidenote layout — for a landing page
 * the goal is to *signal* depth, not deliver an essay.
 *
 * Uses a Popover (click/tap) rather than a Tooltip so it opens on touch too — a
 * hover-only tooltip left the qualifier unreachable on mobile. Closes on
 * outside-click / Escape; keyboard- and screen-reader-accessible via Radix.
 *
 * Numbering is manual: pass `number` per call. Three or four total across the
 * whole page is the right ceiling; more turns into noise. Emits `footnote_open`
 * when opened, so analytics can answer "is anyone actually reading these?"
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
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          {/* Ringed rather than bare. The marker used to be a coloured digit and
              nothing else: no underline, no border, no pointer, so its only
              signal that it opened anything was hue. A reader reported it as
              looking like a typo. The ring costs nothing and says "control". */}
          <button
            type="button"
            aria-label={`הערה ${number}, פתח להסבר`}
            className="ms-0.5 inline-block cursor-pointer rounded-full border border-primary/40 px-[0.4em] align-super text-[0.62em] font-bold leading-normal text-primary/90 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            {number}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={6}
          dir="rtl"
          className="w-auto max-w-xs whitespace-normal break-words border-0 bg-foreground p-3 text-start text-xs leading-relaxed text-background shadow-md"
        >
          {tip}
        </PopoverContent>
      </Popover>
    </>
  );
};
