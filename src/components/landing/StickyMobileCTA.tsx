import { useEffect, useState, type MouseEvent } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { getConsent } from "@/lib/consent";
import { useDiagnosticForm } from "./DiagnosticFormProvider";

/**
 * Phone-only bar that carries the CTA once the hero's has scrolled away.
 *
 * Shown between the hero and the booking block: it has no job while either
 * CTA is already on screen, and it would sit on top of the calendar. It also
 * waits for the consent banner, which occupies the same strip.
 *
 * The dwell-phase copy that used to rotate the label by time on page is gone.
 * One label, the same one the hero uses, so the button a reader meets at the
 * bottom is recognisably the button she skipped at the top.
 *
 * While hidden it leaves the tab order: an aria-hidden container with a
 * focusable control inside is what Lighthouse flagged on the previous page.
 */
const StickyMobileCTA = () => {
  const { requestForm } = useDiagnosticForm();
  const [pastHero, setPastHero] = useState(false);
  const [atBook, setAtBook] = useState(false);
  const [consentPending, setConsentPending] = useState(true);

  useEffect(() => {
    setConsentPending(getConsent() === null);
    const onConsent = () => setConsentPending(false);
    window.addEventListener("cor:consent-decided", onConsent);

    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    const book = document.getElementById("book");
    if (book && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => setAtBook(entry.isIntersecting), {
        rootMargin: "0px 0px -20% 0px",
      });
      io.observe(book);
    }

    return () => {
      window.removeEventListener("cor:consent-decided", onConsent);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const visible = pastHero && !atBook && !consentPending;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick("sticky_mobile");
    e.preventDefault();
    requestForm("sticky");
  };

  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      data-shown={visible ? "" : undefined}
      className="ld-sticky fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
      <a
        href="#book"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        className="ld-cta mx-auto flex w-full max-w-xl"
      >
        לתיאום שיחת התאמה · 30 דקות
      </a>
    </div>
  );
};

export default StickyMobileCTA;
