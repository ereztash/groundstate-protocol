import { Link } from "react-router-dom";
import { CorMark, CorSeal } from "@/components/brand/CorMark";

/**
 * The one site-wide footer, used by every page (replacing the divergent
 * per-page footers). Charcoal, the brand's SYS surface, so the page ends on a
 * closed back cover with the seal on it. Colors are hard-coded to the cor-brand
 * palette (not theme tokens) so it renders identically wherever it's dropped,
 * regardless of an ancestor band. Measured on charcoal: clinical 15.0:1,
 * mist 7.3:1. Landing-section links are deep links (/#…) so they work from any page
 * (Landing scrolls to the hash on mount).
 */

const LINKS = [
  { to: "/protocol", label: "הפרוטוקול" },
  { to: "/insights", label: "תובנות" },
  { to: "/about", label: "אודות" },
  { to: "/#price", label: "תמחור" },
  { to: "/#faq", label: "שאלות" },
  { to: "/privacy", label: "פרטיות" },
  { to: "/accessibility", label: "נגישות" },
];

const SiteFooter = () => (
  <footer
    dir="rtl"
    className="border-t border-[#3A3A52] bg-[#1C1C2E] text-[#F5F2ED]"
  >
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="flex items-center gap-2.5 font-heading text-lg font-black">
            ארז טל-שיר
            <CorMark className="h-[14px] w-[38px]" />
          </p>
          <p className="text-xs leading-relaxed text-[#ABA9B8]">
            עובד סוציאלי טכנולוגי. יועץ עסקי לעצמאים.
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
              className="text-sm text-[#ABA9B8] transition-colors hover:text-[#F5F2ED]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#3A3A52] pt-8 text-center text-xs text-[#ABA9B8]">
        <CorSeal id="cor-seal-footer" className="h-16 w-16 text-[#7DB3AE]" />
        © ארז טל-שיר, COR-SYS 2026
      </div>
    </div>
  </footer>
);

export default SiteFooter;
