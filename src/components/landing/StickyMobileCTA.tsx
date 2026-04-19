import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useCalendly } from "./CalendlyProvider";

/**
 * Sticky CTA bar for mobile (<md).
 *
 * Research basis:
 *  - Persistent affordance: conversion uplift from sticky CTAs on mobile is
 *    consistently reported in CXL/Baymard field tests (~10–20%).
 *  - Fitts's Law: large, always-accessible target minimizes acquisition time.
 *  - Appears only after scroll past the Hero (goal-gradient / engagement cue
 *    — Kivetz, Urminsky, Zheng 2006): user has shown intent by scrolling.
 *  - Hides on very bottom so it doesn't overlap BookingSection's own CTA.
 */
const StickyMobileCTA = () => {
  const { open } = useCalendly();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const pageBottom =
        document.documentElement.scrollHeight - window.innerHeight;
      // Show after ~85% of viewport scroll; hide when within 400px of bottom.
      const showAfterHero = y > window.innerHeight * 0.85;
      const nearBottom = y > pageBottom - 400;
      setVisible(showAfterHero && !nearBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 p-3 backdrop-blur-lg transition-all duration-300 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">
            ₪2,000 לתהליך כולו
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            שיחת אבחון 20 דק׳ · ללא התחייבות
          </p>
        </div>
        <button
          onClick={open}
          className="cta-warm inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-xs font-semibold tracking-wide"
          aria-label="קבע שיחת אבחון"
        >
          <Calendar className="h-3.5 w-3.5" />
          קבע 20 דק׳
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
