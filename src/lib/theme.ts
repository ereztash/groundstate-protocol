/**
 * The reader's light/dark choice.
 *
 * Light is the default for everyone, including readers whose system is set to
 * dark. The brand test (pre-registered 30.9) showed the charcoal first screen
 * to people from the target group and all three rated its look 1 of 5, so the
 * site does not choose dark for anyone; a reader who wants it asks for it, and
 * the choice is remembered.
 *
 * index.html applies a stored choice in an inline script before the first
 * paint, with the same key, so a returning dark reader never sees a light
 * flash. Keep the two in step.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "cor-theme";

const THEME_COLOR: Record<Theme, string> = {
  light: "#EFE9DD",
  dark: "#1C1C2E",
};

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable: the choice holds for this page view only */
  }
}
