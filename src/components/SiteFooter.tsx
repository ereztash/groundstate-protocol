import { Link } from "react-router-dom";

/**
 * The one site-wide footer, used by every page (replacing the divergent
 * per-page footers). Charcoal, matching SiteHeader — so the site is framed by
 * the same dark bar top and bottom. Colors are hard-coded (not theme tokens)
 * so it renders identically wherever it's dropped, regardless of an ancestor
 * band. Landing-section links are deep links (/#…) so they work from any page
 * (Landing scrolls to the hash on mount).
 */

const LINKS = [
  { to: "/protocol", label: "הפרוטוקול" },
  { to: "/insights", label: "תובנות" },
  { to: "/about", label: "אודות" },
  { to: "/#full-package", label: "תמחור" },
  { to: "/#faq", label: "שאלות" },
  { to: "/privacy", label: "פרטיות" },
];

const SiteFooter = () => (
  <footer
    dir="rtl"
    className="border-t border-white/10 bg-[#15191c] text-[hsl(40_30%_96%)]"
  >
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="text-base font-semibold">ארז טל-שיר</p>
          <p className="text-xs leading-relaxed text-white/55">
            עובד סוציאלי בהכשרה. יועץ עסקי לעצמאים בפועל.
          </p>
        </div>

        <nav
          aria-label="ניווט תחתון"
          className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-7"
        >
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
        © ארז טל-שיר — COR-SYS 2026
      </div>
    </div>
  </footer>
);

export default SiteFooter;
