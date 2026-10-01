import { useEffect, useState, type MouseEvent } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { getConsent } from "@/lib/consent";
import { useOptionalDiagnosticForm } from "./DiagnosticFormProvider";
import { whatsappUrl, type Lang } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";

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
const LABELS = {
  he: { cta: "לתיאום שיחת התאמה, 30 דקות", whatsapp: "כתבו לי בוואטסאפ" },
  en: { cta: "Book a fit call, 30 min", whatsapp: "Message me on WhatsApp" },
} as const;

/** `lang="en"` is the English home page's bar: no form provider there, so the
 *  button is a plain link to that page's #book. */
const StickyMobileCTA = ({ lang = "he" }: { lang?: Lang }) => {
  const form = useOptionalDiagnosticForm();
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
    trackCtaClick(lang === "en" ? "en_sticky_mobile" : "sticky_mobile");
    if (!form) return;
    e.preventDefault();
    form.requestForm("sticky");
  };

  return (
    <div
      dir={lang === "en" ? "ltr" : "rtl"}
      aria-hidden={!visible}
      data-shown={visible ? "" : undefined}
      className="ld-sticky fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
      {/* WhatsApp sits beside the booking button (2026-10-01): on a phone
          this bar is where the floating WhatsApp button would go, so the two
          share it instead of stacking. */}
      <div className="mx-auto flex w-full max-w-xl gap-2">
        <a
          href="#book"
          onClick={onClick}
          tabIndex={visible ? 0 : -1}
          className="ld-cta flex-1"
        >
          {LABELS[lang].cta}
        </a>
        <a
          href={whatsappUrl(lang)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick("whatsapp_sticky")}
          tabIndex={visible ? 0 : -1}
          aria-label={LABELS[lang].whatsapp}
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[3px] border border-foreground/25 bg-card text-foreground"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
