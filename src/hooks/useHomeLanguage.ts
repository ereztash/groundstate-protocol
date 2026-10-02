import { useEffect } from "react";

const SITE_ORIGIN = "https://ereztash.github.io/groundstate-protocol";

/** The two home pages are translations of each other; nothing else is. */
const ALTERNATES: ReadonlyArray<readonly [string, string]> = [
  ["he", "/"],
  ["en", "/en/"],
  ["x-default", "/"],
];

/**
 * While a home page is mounted: the document's language and direction, its
 * og:locale, and hreflang links to both versions. Prerender serialises the
 * DOM after this runs, so /en/ ships as <html lang="en" dir="ltr"> before any
 * script, and search engines see the pair from either side.
 *
 * Links are upserted, not appended: the Hebrew home page hydrates over
 * prerendered HTML that already carries them. On the way out everything goes
 * back to the site's default, Hebrew, rather than to what was there on
 * arrival: a visitor who lands on /en/ arrives on a document that is already
 * English, and every other page is Hebrew.
 */
export function useHomeLanguage(lang: "he" | "en"): void {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";

    const links: HTMLLinkElement[] = [];
    for (const [hreflang, path] of ALTERNATES) {
      let el = document.head.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${hreflang}"]`
      );
      if (!el) {
        el = document.createElement("link");
        el.rel = "alternate";
        el.hreflang = hreflang;
        document.head.appendChild(el);
      }
      el.href = SITE_ORIGIN + path;
      links.push(el);
    }

    const locale = document.head.querySelector('meta[property="og:locale"]');
    locale?.setAttribute("content", lang === "en" ? "en_US" : "he_IL");

    return () => {
      root.lang = "he";
      root.dir = "rtl";
      for (const el of links) el.remove();
      locale?.setAttribute("content", "he_IL");
    };
  }, [lang]);
}
