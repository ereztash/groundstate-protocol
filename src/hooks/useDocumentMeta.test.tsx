import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentMeta } from "./useDocumentMeta";

/**
 * The runtime <head> layer, which is what a visitor moving between routes sees
 * and what a JS-executing scraper reads. The prerender step bakes the same
 * values into each route's static HTML, so this hook is not what Google reads
 * first — but it is the only thing keeping one route's tags off another's, and
 * that failure mode is silent. A leaked title looks like nothing; a leaked
 * noindex deindexes the page it leaks onto.
 *
 * Two properties are load-bearing and are why this file exists:
 *
 *  - Restore on unmount, exactly. A tag the hook created must be removed; a tag
 *    it overwrote must get its previous content back, not be deleted. Those are
 *    different code paths and only one of them is exercised by a page that
 *    happens to have static tags in index.html.
 *  - Canonical URLs end in a slash. Pages are served as directory indexes and
 *    the host 301s the slashless form, so a canonical without the slash points
 *    at a redirect, which is a canonical pointing away from itself.
 */

const head = () => document.head;
const meta = (attr: "name" | "property", key: string) =>
  head().querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
const canonical = () =>
  head().querySelector<HTMLLinkElement>('link[rel="canonical"]');

const ORIGIN = "https://ereztash.github.io/groundstate-protocol";

describe("useDocumentMeta()", () => {
  beforeEach(() => {
    head().innerHTML = "";
    document.title = "";
  });

  it("sets the title and restores the previous one on unmount", () => {
    document.title = "COR-SYS";
    const { unmount } = renderHook(() =>
      useDocumentMeta({ title: "אודות | COR-SYS" })
    );

    expect(document.title).toBe("אודות | COR-SYS");
    unmount();
    expect(document.title).toBe("COR-SYS");
  });

  it("mirrors the title into og:title, and prefers ogTitle when given", () => {
    const a = renderHook(() => useDocumentMeta({ title: "כותרת" }));
    expect(meta("property", "og:title")?.content).toBe("כותרת");
    a.unmount();

    renderHook(() =>
      useDocumentMeta({ title: "כותרת", ogTitle: "כותרת לשיתוף" })
    );
    expect(meta("property", "og:title")?.content).toBe("כותרת לשיתוף");
  });

  it("writes description to both description and og:description", () => {
    renderHook(() =>
      useDocumentMeta({ title: "כותרת", description: "תיאור הדף." })
    );

    expect(meta("name", "description")?.content).toBe("תיאור הדף.");
    expect(meta("property", "og:description")?.content).toBe("תיאור הדף.");
  });

  it("lets ogDescription differ from description", () => {
    renderHook(() =>
      useDocumentMeta({
        title: "כותרת",
        description: "תיאור למנוע חיפוש.",
        ogDescription: "תיאור לשיתוף ברשת.",
      })
    );

    expect(meta("name", "description")?.content).toBe("תיאור למנוע חיפוש.");
    expect(meta("property", "og:description")?.content).toBe(
      "תיאור לשיתוף ברשת."
    );
  });

  it("emits no description tags when no description is given", () => {
    renderHook(() => useDocumentMeta({ title: "כותרת" }));

    expect(meta("name", "description")).toBeNull();
    expect(meta("property", "og:description")).toBeNull();
  });

  describe("canonical", () => {
    it("resolves the path against the live origin, with a trailing slash", () => {
      renderHook(() => useDocumentMeta({ title: "כותרת", path: "/about" }));

      expect(canonical()?.href).toBe(`${ORIGIN}/about/`);
      expect(meta("property", "og:url")?.content).toBe(`${ORIGIN}/about/`);
    });

    it("does not double the slash on a path that already has one", () => {
      renderHook(() =>
        useDocumentMeta({ title: "כותרת", path: "/insights/some-slug/" })
      );

      expect(canonical()?.href).toBe(`${ORIGIN}/insights/some-slug/`);
    });

    it("emits nothing when no path is given", () => {
      renderHook(() => useDocumentMeta({ title: "כותרת" }));

      expect(canonical()).toBeNull();
      expect(meta("property", "og:url")).toBeNull();
    });
  });

  describe("robots", () => {
    it("is absent unless asked for", () => {
      renderHook(() => useDocumentMeta({ title: "כותרת" }));
      expect(meta("name", "robots")).toBeNull();
    });

    /**
     * The reason this file is worth its length.
     *
     * /case-intake and /guarantee-review set noindex. They are compiled out of
     * production today, so this cannot currently bite — but the hook is the
     * generic mechanism, the directive is one prop, and a noindex that outlives
     * its route lands on whatever the visitor opens next. Deindexing the
     * landing page produces no error, no console warning, and no visible
     * change; it shows up weeks later as traffic that stopped.
     */
    it("does not survive the route that set it", () => {
      const tool = renderHook(() =>
        useDocumentMeta({ title: "כלי פנימי", robots: "noindex,nofollow" })
      );
      expect(meta("name", "robots")?.content).toBe("noindex,nofollow");

      tool.unmount();
      expect(meta("name", "robots")).toBeNull();

      renderHook(() => useDocumentMeta({ title: "COR-SYS", path: "/" }));
      expect(meta("name", "robots")).toBeNull();
    });
  });

  describe("restoring tags that already existed", () => {
    /**
     * index.html ships the landing page's meta statically. A secondary route
     * overwrites those tags rather than adding its own, so unmount has to put
     * the old content back. Removing the element instead would strip the
     * landing page's description the first time a visitor navigated away and
     * back, and the prerendered HTML would still look correct in the repo.
     */
    it("puts back the previous content instead of removing the tag", () => {
      const existing = document.createElement("meta");
      existing.setAttribute("name", "description");
      existing.setAttribute("content", "התיאור של דף הבית.");
      head().appendChild(existing);

      const { unmount } = renderHook(() =>
        useDocumentMeta({ title: "כותרת", description: "התיאור של דף המאמר." })
      );
      expect(meta("name", "description")?.content).toBe("התיאור של דף המאמר.");

      unmount();
      expect(meta("name", "description")).not.toBeNull();
      expect(meta("name", "description")?.content).toBe("התיאור של דף הבית.");
    });

    it("puts back a previous canonical href", () => {
      const existing = document.createElement("link");
      existing.setAttribute("rel", "canonical");
      existing.setAttribute("href", `${ORIGIN}/`);
      head().appendChild(existing);

      const { unmount } = renderHook(() =>
        useDocumentMeta({ title: "כותרת", path: "/protocol" })
      );
      expect(canonical()?.href).toBe(`${ORIGIN}/protocol/`);

      unmount();
      expect(canonical()?.href).toBe(`${ORIGIN}/`);
    });

    it("removes a tag it created rather than blanking it", () => {
      const { unmount } = renderHook(() =>
        useDocumentMeta({ title: "כותרת", description: "תיאור." })
      );
      expect(meta("name", "description")).not.toBeNull();

      unmount();
      expect(meta("name", "description")).toBeNull();
    });
  });

  /**
   * Two routes mounted in sequence is the ordinary case; this asserts the
   * second one's values fully replace the first's rather than merging with
   * them, which is what a missed restore looks like from the outside.
   */
  it("does not leak one route's tags into the next", () => {
    const first = renderHook(() =>
      useDocumentMeta({
        title: "מאמר",
        description: "תיאור המאמר.",
        path: "/insights/slug",
      })
    );
    first.unmount();

    renderHook(() => useDocumentMeta({ title: "אודות", path: "/about" }));

    expect(document.title).toBe("אודות");
    expect(canonical()?.href).toBe(`${ORIGIN}/about/`);
    expect(meta("name", "description")).toBeNull();
  });
});
