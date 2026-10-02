import { Link } from "react-router-dom";
import { CorMark, CorSeal } from "@/components/brand/CorMark";
import { LinkedInIcon, WhatsAppIcon } from "@/components/brand/SocialIcons";
import { LINKEDIN_URL, WHATSAPP_DISPLAY, whatsappUrl, type Lang } from "@/lib/contact";

/**
 * The one site-wide footer, used by every page (replacing the divergent
 * per-page footers). Charcoal, the brand's SYS surface, so the page ends on a
 * closed back cover with the seal on it. Colors are hard-coded to the cor-brand
 * palette (not theme tokens) so it renders identically wherever it's dropped,
 * regardless of an ancestor band. Measured on charcoal: clinical 15.0:1,
 * mist #D2D0DB 11.0:1 (APCA Lc 77; the pilot found #ABA9B8, Lc 55, hard to read).
 * Landing-section links are deep links (/#…) so they work from any page
 * (Landing scrolls to the hash on mount).
 *
 * `lang="en"` is the English home page's footer: its links say which pages
 * are in Hebrew, since only the home page has an English version.
 */

type FooterLink = { to: string; label: string; lang?: string };

const LINKS: Record<Lang, FooterLink[]> = {
  he: [
    { to: "/protocol", label: "הפרוטוקול" },
    { to: "/insights", label: "תובנות" },
    { to: "/about", label: "אודות" },
    { to: "/#price", label: "תמחור" },
    { to: "/#faq", label: "שאלות" },
    { to: "/privacy", label: "פרטיות" },
    { to: "/accessibility", label: "נגישות" },
    { to: "/en", label: "English", lang: "en" },
  ],
  en: [
    { to: "/en#price", label: "Pricing" },
    { to: "/en#faq", label: "Questions" },
    { to: "/privacy", label: "Privacy (in Hebrew)" },
    { to: "/accessibility", label: "Accessibility (in Hebrew)" },
    { to: "/", label: "עברית", lang: "he" },
  ],
};

const T = {
  he: {
    name: "ארז טל-שיר",
    role: "עובד סוציאלי טכנולוגי. יועץ עסקי לעצמאים.",
    linkedin: "לינקדאין",
    opensWhatsapp: " (וואטסאפ, נפתח בחלון חדש)",
    opensNew: " (נפתח בחלון חדש)",
    nav: "ניווט תחתון",
  },
  en: {
    name: "Erez Tal-Shir",
    role: "Social worker and technologist. Business consultant for freelancers.",
    linkedin: "LinkedIn",
    opensWhatsapp: " (WhatsApp, opens in a new window)",
    opensNew: " (opens in a new window)",
    nav: "Footer",
  },
} as const;

const SiteFooter = ({ lang = "he" }: { lang?: Lang }) => {
  const t = T[lang];
  return (
    <footer
      dir={lang === "en" ? "ltr" : "rtl"}
      className="border-t border-[#3A3A52] bg-[#1C1C2E] text-[#F5F2ED]"
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2.5 font-heading text-lg font-black">
              {t.name}
              <CorMark className="h-[14px] w-[38px]" />
            </p>
            <p className="text-xs leading-relaxed text-[#D2D0DB]">{t.role}</p>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm">
              <a
                href={whatsappUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D2D0DB] transition-colors hover:text-[#F5F2ED]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span dir="ltr" className="whitespace-nowrap">{WHATSAPP_DISPLAY}</span>
                <span className="sr-only">{t.opensWhatsapp}</span>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D2D0DB] transition-colors hover:text-[#F5F2ED]"
              >
                <LinkedInIcon className="h-4 w-4" />
                {t.linkedin}
                <span className="sr-only">{t.opensNew}</span>
              </a>
            </p>
          </div>

          <nav
            aria-label={t.nav}
            className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-7"
          >
            {LINKS[lang].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                lang={l.lang}
                hrefLang={l.lang}
                className="text-sm text-[#D2D0DB] transition-colors hover:text-[#F5F2ED]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#3A3A52] pt-8 text-center text-xs text-[#D2D0DB]">
          <CorSeal id="cor-seal-footer" className="h-16 w-16 text-[#B3D6D2]" />
          © {t.name}, COR-SYS 2026
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
