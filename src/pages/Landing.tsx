import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import PainSection from "@/components/landing/PainSection";
import OriginStorySection from "@/components/landing/OriginStorySection";
import SequenceSection from "@/components/landing/SequenceSection";
import FullPackageSection from "@/components/landing/FullPackageSection";
import RiskReversalSection from "@/components/landing/RiskReversalSection";
import ClientProofSection from "@/components/landing/ClientProofSection";
import MidPageCTA from "@/components/landing/MidPageCTA";
import ProcessPreviewSection from "@/components/landing/ProcessPreviewSection";
import CommitmentSection from "@/components/landing/CommitmentSection";
import NotForEveryoneSection from "@/components/landing/NotForEveryoneSection";
import FAQSection from "@/components/landing/FAQSection";
import PreFormSection from "@/components/landing/PreFormSection";
import DiagnosticFormSection from "@/components/landing/DiagnosticFormSection";
import LandingFooter from "@/components/landing/LandingFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import ScrollProgressBar from "@/components/landing/ScrollProgressBar";
import { DiagnosticFormProvider } from "@/components/landing/DiagnosticFormProvider";
import { trackScrollDepth } from "@/lib/analytics";

const Landing = () => {
  const reachedRef = useRef<Set<number>>(new Set());

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
      <a href="#hero" className="skip-to-content">
        דלג לתוכן
      </a>

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <ScrollProgressBar />
        <Header />

        <main className="divide-y divide-border">
          <Hero />
          <PainSection />
          <OriginStorySection />
          <SequenceSection />
          <FullPackageSection />
          <RiskReversalSection />
          <ClientProofSection />
          <MidPageCTA />
          <ProcessPreviewSection />
          <CommitmentSection />
          <NotForEveryoneSection />
          <FAQSection />
          <PreFormSection />
          <DiagnosticFormSection />
        </main>

        <LandingFooter />
        <StickyMobileCTA />
      </div>
    </DiagnosticFormProvider>
  );
};

export default Landing;
