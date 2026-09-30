import { useEffect, useMemo, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/landing/Hero";
import WhatYouTriedSection from "@/components/landing/WhatYouTriedSection";
import OfferSection from "@/components/landing/OfferSection";
import Day31Section from "@/components/landing/Day31Section";
import ProofSection from "@/components/landing/ProofSection";
import EvidenceSection from "@/components/landing/EvidenceSection";
import FitSection from "@/components/landing/FitSection";
import FAQSection from "@/components/landing/FAQSection";
import BookSection from "@/components/landing/BookSection";
import SiteFooter from "@/components/SiteFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { DiagnosticFormProvider } from "@/components/landing/DiagnosticFormProvider";
import { trackScrollDepth } from "@/lib/analytics";
import { parseLeadSource } from "@/lib/web3forms";

/**
 * The landing page, rebuilt 2026-09-29 ("the last draft").
 *
 * Nine blocks where there were twenty-two, in the order a buying decision is
 * made: recognise the problem, see what you get and what it costs, want it,
 * check that others got it, check that it fits you, clear the last questions,
 * book. The page was 17 screens deep on a phone and put the price thirteen
 * screens down; it is now roughly a third of that, with the price in the hero.
 *
 * What left, and where it went:
 * - The stage-by-stage price ladder, the package-as-discount card and the
 *   stage quiz: one offer now (OfferSection). Stages remain for sale, priced
 *   on /protocol.
 * - What the method has and has not proven: back on this page as
 *   EvidenceSection, right after the testimonials, where the reader is
 *   weighing whether to believe them. The operator's site brief treats the
 *   published pre-registration as the site's one uncopyable asset.
 *   /protocol keeps the fuller ClaimsShelf and PreRegistration.
 * - The two surfaced objections: folded into the FAQ, printed open.
 * - The "what happens in the call" timeline and the mid-page CTAs: the call
 *   now sits next to the calendar it is booked in (BookSection), and the
 *   phone keeps a sticky CTA between the hero and the calendar.
 */
const Landing = () => {
  const reachedRef = useRef<Set<number>>(new Set());

  // Visitors arriving from another page's CTA carry ?src=. Read once, on the
  // first render, so the value is already in the provider if they book or
  // submit without touching any in-page CTA.
  const initialSource = useMemo(() => {
    if (typeof window === "undefined") return null;
    return parseLeadSource(
      new URLSearchParams(window.location.search).get("src"),
    );
  }, []);

  // Deep-link support. Content pages send their CTA to "/#book". Links already
  // out in the world still say "/#diagnostic-form", which now lives inside the
  // booking block and only mounts on demand, so that hash lands on #book too.
  // React Router doesn't scroll to hashes on navigation, so do it here.
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    const id = raw === "diagnostic-form" ? "book" : raw;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.min(
        100,
        Math.round((window.scrollY / docHeight) * 100),
      );
      for (const m of milestones) {
        if (percent >= m && !reachedRef.current.has(m)) {
          reachedRef.current.add(m);
          trackScrollDepth(m);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <DiagnosticFormProvider initialSource={initialSource}>
      <a href="#hero" className="skip-to-content">
        דלג לתוכן
      </a>

      <div data-page="landing" className="ld-paper min-h-screen overflow-x-hidden text-foreground">
        <SiteHeader />

        <main>
          <Hero />
          <WhatYouTriedSection />
          <OfferSection />
          <Day31Section />
          <ProofSection />
          <EvidenceSection />
          <FitSection />
          <FAQSection />
          <BookSection />
        </main>

        <SiteFooter />
        <StickyMobileCTA />
      </div>
    </DiagnosticFormProvider>
  );
};

export default Landing;
