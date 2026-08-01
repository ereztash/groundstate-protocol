import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { trackCtaClick } from "@/lib/analytics";
import { useOptionalDiagnosticForm } from "@/components/landing/DiagnosticFormProvider";

/**
 * The one site-wide top bar, used by every page (replacing the per-page
 * headers). Charcoal so it reads as a single consistent frame over any
 * section beneath it — and so it matches the dark bands and the /protocol hero.
 *
 * Wayfinding without leaking conversion: the nav points only to owned content
 * (protocol / insights / about) that builds trust, and the copper CTA stays the
 * visually dominant action. On the landing route the CTA scrolls to the form
 * in-page; everywhere else it deep-links to /#diagnostic-form (Landing scrolls
 * to the hash on mount). Nav collapses into an accessible disclosure menu on
 * mobile; the CTA stays visible at every width.
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#15191c]/90 backdrop-blur-md">
      <div
        dir="rtl"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
      >
        <Link
          to="/"
          className="text-base font-semibold tracking-wide text-[hsl(40_30%_96%)] outline-none"
          aria-label="COR-SYS, לעמוד הבית"
        >
          COR-SYS
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-sm text-white/65 transition-colors hover:text-white"
              activeClassName="text-white"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Off-landing this is a real navigation, so the source rides the
              query string — Landing reads it into the provider on mount. */}
          <Link
            to="/?src=header#diagnostic-form"
            onClick={onCta}
            className="cta-warm inline-flex h-9 items-center rounded-md px-3.5 text-xs font-semibold md:px-4 md:text-sm"
          >
            בואי נדבר
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:text-white md:hidden"
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
          className="border-t border-white/10 bg-[#15191c]/97 px-6 py-2 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  activeClassName="text-white"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
