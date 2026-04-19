import { useRef } from "react";
import Header from "@/components/Header";
import { CalendlyProvider } from "@/components/landing/CalendlyProvider";
import Hero from "@/components/landing/Hero";
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

/**
 * Protocol Ocean Blue — landing page.
 * Thin orchestrator: CalendlyProvider owns the popup modal; Hero's secondary
 * CTA scrolls to the methodology anchor so visitors can see the "how" without
 * committing to a booking.
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
      </div>
    </CalendlyProvider>
  );
};

export default Landing;
