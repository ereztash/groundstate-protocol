import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { trackCtaClick } from "@/lib/analytics";
import { useOptionalDiagnosticForm } from "@/components/landing/DiagnosticFormProvider";
import { CorMark } from "@/components/brand/CorMark";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import ThemeToggle from "@/components/ThemeToggle";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";

/**
 * The one site-wide top bar, used by every page (replacing the per-page
 * headers). Paper with an ink rule since 2026-09-29, so the page reads as one
 * printed sheet from the first pixel rather than a dark app frame around it.
 *
 * Wayfinding without leaking conversion: the nav points only to owned content
 * (protocol / insights / about) that builds trust, and the copper CTA stays the
 * visually dominant action. On the landing route the CTA scrolls to the form
 * in-page; everywhere else it deep-links to /#book (Landing scrolls to the hash
 * on mount). Nav collapses into an accessible disclosure menu on
 * mobile; the CTA stays visible at every width.
 *
 * The reader's dark-mode switch sits beside the CTA on wide screens. On a
 * phone there is no room for it in the bar (logo, CTA and menu already fill
 * 360px), so it lives in the menu, with WhatsApp (2026-10-01).
 */

const NAV = [
  { to: "/protocol", label: "הפרוטוקול" },
  { to: "/insights", label: "תובנות" },
  { to: "/about", label: "אודות" },
];

const SiteHeader = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  // Null on every route except the landing page — this header ships site-wide,
  // but only the landing page mounts the form provider.
  const form = useOptionalDiagnosticForm();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onCta = (e: MouseEvent) => {
    trackCtaClick("header_diagnostic");
    setOpen(false);
    if (isLanding && form) {
      e.preventDefault();
      // Routed through the provider so the lead records that the header CTA
      // brought it in, rather than arriving as an anonymous direct hit.
      form.requestForm("header");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/10 bg-background/95 backdrop-blur-md">
      <div
        dir="rtl"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 font-heading text-lg font-black tracking-tight text-foreground outline-none"
          aria-label="COR-SYS, לעמוד הבית"
        >
          COR-SYS
          <CorMark className="h-4 w-[43px]" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-foreground"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden h-9 w-9 justify-center md:inline-flex" />
          {/* Off-landing this is a real navigation, so the source rides the
              query string — Landing reads it into the provider on mount. */}
          <Link
            to="/?src=header#book"
            onClick={onCta}
            className="ld-cta !min-h-0 h-9 !px-3.5 !text-sm md:!px-4"
          >
            שיחת התאמה, 30 דקות
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            aria-controls="site-nav-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="site-nav-mobile"
          dir="rtl"
          className="border-t border-foreground/10 bg-background px-5 py-2 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  activeClassName="text-foreground"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t border-foreground/10 px-2 py-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("whatsapp_menu")}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              וואטסאפ <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              <span className="sr-only"> (נפתח בוואטסאפ)</span>
            </a>
            <ThemeToggle withLabel className="py-1" />
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
