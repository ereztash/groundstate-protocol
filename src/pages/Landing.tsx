import { useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/landing/Hero";
import WhatYouTriedSection from "@/components/landing/WhatYouTriedSection";
import OriginStorySection from "@/components/landing/OriginStorySection";
import SequenceSection from "@/components/landing/SequenceSection";
import StageRecommenderSection from "@/components/landing/StageRecommenderSection";
import DeliverablesPreview from "@/components/landing/DeliverablesPreview";
import NotForEveryoneSection from "@/components/landing/NotForEveryoneSection";
import FullPackageSection from "@/components/landing/FullPackageSection";
import ClientProofSection from "@/components/landing/ClientProofSection";
import ProcessPreviewSection from "@/components/landing/ProcessPreviewSection";
import MidPageCTA from "@/components/landing/MidPageCTA";
import FAQSection from "@/components/landing/FAQSection";
import DiagnosticFormSection from "@/components/landing/DiagnosticFormSection";
import SiteFooter from "@/components/SiteFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import ScrollProgress from "@/components/landing/ScrollProgress";
import { DiagnosticFormProvider } from "@/components/landing/DiagnosticFormProvider";
import { trackScrollDepth } from "@/lib/analytics";

const Landing = () => {
  const reachedRef = useRef<Set<number>>(new Set());

  // Deep-link support: content pages (articles, about, protocol) send their
  // CTA to "/#diagnostic-form" so a warm reader lands ON the form, not at the
  // top of the funnel. React Router doesn't scroll to hashes on navigation, so
  // do it here once the sections have mounted.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Two frames: let lazy sections lay out before measuring.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      })
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
        Math.round((window.scrollY / docHeight) * 100)
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
    <DiagnosticFormProvider>
      <ScrollProgress />
      <a href="#hero" className="skip-to-content">
        דלג לתוכן
      </a>

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <SiteHeader />

        {/* Dark/light band rhythm: story, mid-CTA and the "not for everyone"
            filter run on charcoal for depth and emphasis; the hero, proof,
            pricing and the form stay light for scannability and conversion
            clarity. Each dark wrapper scopes the .dark token palette (see
            index.css) so the section components render unchanged on charcoal. */}
        <main className="divide-y divide-border">
          <Hero />
          <WhatYouTriedSection />
          <ClientProofSection />
          <div className="dark bg-background text-foreground">
            <OriginStorySection />
          </div>
          <ProcessPreviewSection />
          {/* Mid-page conversion point for "ready-now" visitors. NN/g
              eye-tracking shows attention collapses after the fold (~57% of
              viewing time above it), so a single bottom CTA leaks the visitors
              who are already convinced; re-surfacing the same one goal partway
              down (after they've seen pain → proof → what the call is) catches
              them without competing with the page's single conversion goal. */}
          <div className="dark bg-background text-foreground">
            <MidPageCTA />
          </div>
          <StageRecommenderSection />
          {/* Value before price: the tangible deliverables run before the price
              ladder (the lifetime-ROI line is folded into SequenceSection's
              intro), so the numbers land on top of value already built. The two
              priced offers (Sequence → FullPackage) stay contiguous, and the
              "not for everyone" filter follows them as the final take-away. */}
          <DeliverablesPreview />
          <SequenceSection />
          <FullPackageSection />
          <div className="dark bg-background text-foreground">
            <NotForEveryoneSection />
          </div>
          <FAQSection />
          <DiagnosticFormSection />
        </main>

        <SiteFooter />
        <StickyMobileCTA />
      </div>
    </DiagnosticFormProvider>
  );
};

export default Landing;
