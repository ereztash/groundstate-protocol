import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackCtaClick } from "@/lib/analytics";
import { getConsent } from "@/lib/consent";
import { whatsappUrl, type Lang } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";

const LABEL: Record<Lang, string> = {
  he: "כתבו לי בוואטסאפ",
  en: "Message me on WhatsApp",
};

/**
 * The floating WhatsApp button, on wide screens only, in the corner where the
 * line ends (left in Hebrew, right in English; `end-6` follows the page's
 * direction). Phones get WhatsApp inside the sticky booking bar on the landing
 * page and in the header menu everywhere else, so nothing floats over the bar.
 *
 * It waits for the consent banner to be answered, like the sticky bar, because
 * the banner owns the bottom of the screen until then. Ink, not WhatsApp
 * green: the glyph is recognisable on its own, and the page keeps one colour
 * accent. On the English home page it speaks English and opens the chat with
 * an English first message.
 */
const WhatsAppFloat = () => {
  const { pathname } = useLocation();
  const lang: Lang = /^\/en(\/|$)/.test(pathname) ? "en" : "he";
  const [consentPending, setConsentPending] = useState(true);

  useEffect(() => {
    setConsentPending(getConsent() === null);
    const onConsent = () => setConsentPending(false);
    window.addEventListener("cor:consent-decided", onConsent);
    return () => window.removeEventListener("cor:consent-decided", onConsent);
  }, []);

  if (consentPending) return null;

  // Its own small landmark: content outside every landmark is skipped by
  // screen-reader region navigation (axe "region").
  return (
    <aside aria-label="WhatsApp" className="fixed bottom-6 end-6 z-40 hidden md:block">
      <a
        href={whatsappUrl(lang)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCtaClick("whatsapp_float")}
        aria-label={LABEL[lang]}
        title={LABEL[lang]}
        className="cor-wa-float inline-flex h-14 w-14 items-center justify-center rounded-full bg-cta text-cta-foreground"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </aside>
  );
};

export default WhatsAppFloat;
