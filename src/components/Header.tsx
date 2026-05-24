import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackCtaClick } from "@/lib/analytics";

const scrollToForm = (source: string) => () => {
  trackCtaClick(source);
  document
    .getElementById("diagnostic-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Header = () => {
  // After the user scrolls past the Hero (~half a viewport), promote the
  // header CTA from the quiet outline style to the strong copper style so
  // there's always a visible primary action on desktop.
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Oli Gardner's "1:1 attention ratio" principle: the canonical landing
  // page route ("/") gets no in-page nav — only the brand mark and the
  // single conversion CTA. Other routes keep the nav.
  // No-nav LPs convert 2-3× better in 2026 SaaS data.
  const isLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div
        dir="rtl"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
      >
        <a
          href="#hero"
          className="group flex items-center gap-2 outline-none"
          aria-label="COR-SYS"
        >
          <span className="text-base font-semibold tracking-wide text-foreground">
            COR-SYS
          </span>
        </a>

        {!isLanding && (
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#sequence"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              הרצף
            </a>
            <a
              href="#full-package"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              תמחור
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              שאלות
            </a>
          </nav>
        )}

        <button
          type="button"
          onClick={scrollToForm("header_diagnostic")}
          className={`${
            scrolled ? "cta-warm" : "cta-line"
          } inline-flex h-9 items-center gap-2 rounded-md px-3.5 text-xs font-semibold transition-all duration-300 md:px-4 md:text-sm`}
        >
          בוא נדבר
        </button>
      </div>
    </header>
  );
};

export default Header;
