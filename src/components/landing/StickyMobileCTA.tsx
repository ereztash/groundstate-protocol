import { useEffect, useState } from "react";
import { trackCtaClick } from "@/lib/analytics";

const StickyMobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const pageBottom =
        document.documentElement.scrollHeight - window.innerHeight;
      const showAfterHero = y > window.innerHeight * 0.85;
      const nearBottom = y > pageBottom - 400;
      setVisible(showAfterHero && !nearBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    trackCtaClick("sticky_mobile");
    document
      .getElementById("diagnostic-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur-md transition-all duration-300 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="cta-warm inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold"
          aria-label="גלילה לטופס אבחון התאמה"
        >
          20 דקות לאבחון התאמה
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
