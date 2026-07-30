import { useEffect } from "react";

/**
 * Per-route document <head> management, dependency-free.
 *
 * The landing page ships its meta statically in index.html. Secondary routes
 * are client-rendered, so on navigation we set title / description / canonical /
 * OG here and RESTORE the previous values on unmount (so navigating back to "/"
 * doesn't leak this page's title).
 *
 * NOTE: this is the runtime meta layer. It is correct for in-app navigation and
 * for users, but crawlers/social scrapers that don't execute JS see index.html's
 * static tags. Full per-page SEO requires the prerender/SSG step (Phase 0) that
 * bakes these values into each route's static HTML at build time.
 */

// Live GitHub Pages origin (project sub-path). Everything canonical points here
// so the site is indexable today; the ereztalshir.co.il apex isn't connected.
// AT DOMAIN LAUNCH: swap this to "https://ereztalshir.co.il" (and see the note
// in index.html for the full switch checklist).
const SITE_ORIGIN = "https://ereztash.github.io/groundstate-protocol";

export type DocumentMeta = {
  title: string;
  description?: string;
  /** Absolute site path for canonical + og:url, e.g. "/protocol". */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  /**
   * Robots directive, e.g. "noindex,nofollow". Set on internal tools that are
   * reachable by URL but are not part of the public site. Note this is the
   * runtime layer only: a route that must stay out of the index also has to be
   * left out of the prerender route list, since that is what a crawler reads.
   */
  robots?: string;
};

type Restore = () => void;

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
): Restore {
  const existing = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (existing) {
    const prev = existing.getAttribute("content");
    existing.setAttribute("content", content);
    return () => {
      if (prev === null) existing.removeAttribute("content");
      else existing.setAttribute("content", prev);
    };
  }
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  document.head.appendChild(el);
  return () => el.remove();
}

function upsertLink(rel: string, href: string): Restore {
  const existing = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`
  );
  if (existing) {
    const prev = existing.getAttribute("href");
    existing.setAttribute("href", href);
    return () => {
      if (prev === null) existing.removeAttribute("href");
      else existing.setAttribute("href", prev);
    };
  }
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  document.head.appendChild(el);
  return () => el.remove();
}

export function useDocumentMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  robots,
}: DocumentMeta): void {
  useEffect(() => {
    const restores: Restore[] = [];

    const prevTitle = document.title;
    document.title = title;
    restores.push(() => {
      document.title = prevTitle;
    });

    restores.push(upsertMeta("property", "og:title", ogTitle ?? title));

    if (robots) {
      restores.push(upsertMeta("name", "robots", robots));
    }

    if (description) {
      restores.push(upsertMeta("name", "description", description));
      restores.push(
        upsertMeta("property", "og:description", ogDescription ?? description)
      );
    }

    if (path) {
      // Trailing slash: pages are served as directory indexes (/about/) and the
      // host 301-redirects the slashless form — so the canonical must be the
      // final slashed URL, not one that redirects.
      const raw = `${SITE_ORIGIN}${path}`;
      const url = raw.endsWith("/") ? raw : `${raw}/`;
      restores.push(upsertMeta("property", "og:url", url));
      restores.push(upsertLink("canonical", url));
    }

    return () => {
      // Restore in reverse so nested edits unwind cleanly.
      for (const restore of restores.reverse()) restore();
    };
  }, [title, description, path, ogTitle, ogDescription, robots]);
}
