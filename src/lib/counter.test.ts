import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The counter runs for every visitor without asking, so the two cases where it
 * must not load anything are the ones worth pinning: no site code, and the
 * prerender build (which would count the build machine as a visitor).
 */
const scripts = () => document.head.querySelectorAll('script[src*="gc.zgo.at"]');

async function freshCounter(code: string) {
  vi.resetModules();
  vi.stubEnv("VITE_GOATCOUNTER_CODE", code);
  return import("./counter");
}

afterEach(() => {
  vi.unstubAllEnvs();
  scripts().forEach((s) => s.remove());
  delete (window as { __PRERENDER__?: boolean }).__PRERENDER__;
  delete window.goatcounter;
});

describe("cookieless counter", () => {
  it("loads nothing when the site code is set to empty", async () => {
    const { countPage } = await freshCounter("");
    countPage();
    expect(scripts().length).toBe(0);
  });

  it("loads nothing in the prerender build", async () => {
    (window as { __PRERENDER__?: boolean }).__PRERENDER__ = true;
    const { countPage } = await freshCounter("example");
    countPage();
    expect(scripts().length).toBe(0);
  });

  it("loads the script once, pointed at the site's own count address, and leaves counting to the app", async () => {
    const { countPage } = await freshCounter("example");
    countPage();
    countPage();
    const found = scripts();
    expect(found.length).toBe(1);
    expect((found[0] as HTMLScriptElement).dataset.goatcounter).toBe(
      "https://example.goatcounter.com/count"
    );
    expect(window.goatcounter?.no_onload).toBe(true);
  });

  it("counts the page now on screen, not the one the canonical link still names, and credits the previous page as referrer", async () => {
    vi.useFakeTimers();
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `${window.location.origin}/`;
    document.head.appendChild(link);
    try {
      const { countPage } = await freshCounter("example");
      const count = vi.fn();

      countPage(); // first page: "/"
      window.goatcounter!.count = count;
      (scripts()[0] as HTMLScriptElement).dispatchEvent(new Event("load"));
      await vi.advanceTimersByTimeAsync(0);
      expect(count).toHaveBeenLastCalledWith({ path: "/" });

      // An in-app move to a lazily loaded page: the link names "/" for a while.
      window.history.pushState({}, "", "/about");
      countPage();
      await vi.advanceTimersByTimeAsync(300);
      expect(count).toHaveBeenCalledTimes(1); // still waiting for the page to set its link
      link.href = `${window.location.origin}/about`;
      await vi.advanceTimersByTimeAsync(200);
      expect(count).toHaveBeenCalledTimes(2);
      expect(count).toHaveBeenLastCalledWith({ path: "/about", referrer: `${window.location.origin}/` });
    } finally {
      link.remove();
      window.history.pushState({}, "", "/");
      vi.useRealTimers();
    }
  });
});
