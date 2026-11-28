import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConsentBanner from "./ConsentBanner";

// No #hero in these renders, so the banner asks straight away.
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ConsentBanner />
    </MemoryRouter>
  );

describe("ConsentBanner speaks the page's language", () => {
  beforeEach(() => window.localStorage.clear());

  it("is English and left to right on /en, and says the policy is in Hebrew", () => {
    renderAt("/en");
    const region = screen.getByRole("region", { name: "Consent to analytics tools" });
    expect(region.getAttribute("lang")).toBe("en");
    expect(region.getAttribute("dir")).toBe("ltr");
    expect(region.textContent).toContain("They load only after you accept.");
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
    const policy = screen.getByRole("link", { name: "Privacy policy (in Hebrew)" });
    expect(policy.getAttribute("href")).toBe("/privacy");
    expect(policy.getAttribute("hreflang")).toBe("he");
    expect(region.textContent).not.toMatch(/[֐-׿]/);
  });

  it("stays Hebrew and right to left everywhere else", () => {
    for (const path of ["/", "/bidul", "/english-not-a-route"]) {
      const { unmount } = renderAt(path);
      const region = screen.getByRole("region", { name: "הסכמה לשימוש בכלי ניתוח" });
      expect(region.getAttribute("dir")).toBe("rtl");
      expect(screen.getByRole("button", { name: "אישור" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "מדיניות הפרטיות" }).getAttribute("hreflang")).toBeNull();
      unmount();
    }
  });

  it("stays away once a choice is stored", () => {
    window.localStorage.setItem("cor-sys-consent-v1", "denied");
    renderAt("/en");
    expect(screen.queryByRole("region")).toBeNull();
  });
});
