import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import OriginStorySection from "@/components/landing/OriginStorySection";
import SequenceSection from "@/components/landing/SequenceSection";
import FullPackageSection from "@/components/landing/FullPackageSection";
import NotForEveryoneSection from "@/components/landing/NotForEveryoneSection";
import CommitmentSection from "@/components/landing/CommitmentSection";
import ClientProofSection from "@/components/landing/ClientProofSection";
import FAQSection from "@/components/landing/FAQSection";
import DiagnosticFormSection from "@/components/landing/DiagnosticFormSection";
import LandingFooter from "@/components/landing/LandingFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
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
        <Header />

        <main>
          <Hero />
          <OriginStorySection />
          <SequenceSection />
          <FullPackageSection />
          <NotForEveryoneSection />
          <CommitmentSection />
          <ClientProofSection />
          <FAQSection />
          <DiagnosticFormSection />
        </main>

        <LandingFooter />
        <StickyMobileCTA />
      </div>
    </DiagnosticFormProvider>
  );
};

export default Landing;
