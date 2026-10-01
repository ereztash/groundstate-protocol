import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { applyTheme, currentTheme } from "@/lib/theme";
import type { Lang } from "@/lib/contact";

const LABEL: Record<Lang, string> = { he: "מצב כהה", en: "Dark mode" };

/**
 * The reader's dark-mode switch: a toggle button, pressed when dark is on.
 *
 * The icon is chosen by CSS from the class on <html> (.cor-theme-sun /
 * .cor-theme-moon in index.css), not by React state. A returning dark reader
 * gets the class from index.html's inline script before the first paint, and
 * the prerendered button already shows the right icon; state only drives
 * aria-pressed, which is set after mount so hydration sees the same markup the
 * prerender wrote.
 */
const ThemeToggle = ({
  lang = "he",
  withLabel = false,
  className = "",
}: {
  lang?: Lang;
  /** Show the words beside the icon (the mobile menu, where there is room). */
  withLabel?: boolean;
  className?: string;
}) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(currentTheme() === "dark");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    applyTheme(next);
    setDark(next === "dark");
    trackEvent("theme_toggle", { theme: next });
  };

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={withLabel ? undefined : LABEL[lang]}
      title={withLabel ? undefined : LABEL[lang]}
      onClick={toggle}
      className={`inline-flex items-center gap-2.5 rounded-md text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="cor-theme-moon h-[18px] w-[18px]">
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="cor-theme-sun h-[18px] w-[18px]">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {withLabel && <span className="text-sm font-semibold">{LABEL[lang]}</span>}
    </button>
  );
};

export default ThemeToggle;
