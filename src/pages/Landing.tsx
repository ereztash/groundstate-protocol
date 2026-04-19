import { useRef } from "react";
import Header from "@/components/Header";
import { CalendlyProvider } from "@/components/landing/CalendlyProvider";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import ProblemSection from "@/components/landing/ProblemSection";
import MethodologySection from "@/components/landing/MethodologySection";
import ChessSection from "@/components/landing/ChessSection";
import SprintTimelineSection from "@/components/landing/SprintTimelineSection";
import DeliverablesSection from "@/components/landing/DeliverablesSection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import BookingSection from "@/components/landing/BookingSection";
import LandingFooter from "@/components/landing/LandingFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

/**
 * Protocol Ocean Blue — landing page.
 *
 * Section order maps a visitor's conversion journey through documented
 * cognitive thresholds:
 *  1. Hero — attention + value prop (5 sec test, Nielsen Norman)
 *  2. TrustStrip — risk reduction pre-body (Thaler 1985 mental accounting)
 *  3. Problem — gap framing + loss aversion (Kahneman & Tversky 1979)
 *  4. Methodology — 3 parallel tracks, under working-memory limit (Cowan 2001)
 *  5. Chess — reverse-engineering, concrete mental model (Trope & Liberman 2010)
 *  6. Timeline — goal gradient cues (Kivetz, Urminsky, Zheng 2006)
 *  7. Deliverables — concrete outcomes (construal level theory)
 *  8. Outcomes — numeric anchors (Tversky & Kahneman 1974)
 *  9. Pricing — value proposition with industry anchor
 * 10. FAQ — objection handling in serial-position order (Ebbinghaus 1885)
 * 11. Booking — implementation intentions (Gollwitzer 1999)
 *
 * StickyMobileCTA persists the primary action after the Hero exits viewport
 * for mobile visitors (Fitts's Law + persistent affordance).
 */
const Landing = () => {
  const methodologyRef = useRef<HTMLElement>(null);

  const scrollToMethodology = () => {
    methodologyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <CalendlyProvider>
      <a href="#hero" className="skip-to-content">
        דלג לתוכן
      </a>

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Header />

        <main>
          <Hero onSecondaryClick={scrollToMethodology} />
          <TrustStrip />
          <ProblemSection />
          <MethodologySection anchorRef={methodologyRef} />
          <ChessSection />
          <SprintTimelineSection />
          <DeliverablesSection />
          <OutcomesSection />
          <PricingSection />
          <FAQSection />
          <BookingSection />
        </main>

        <LandingFooter />
        <StickyMobileCTA />
      </div>
    </CalendlyProvider>
  );
};

export default Landing;
