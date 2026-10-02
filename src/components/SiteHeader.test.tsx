import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import SiteHeader from "./SiteHeader";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>
  );

describe("SiteHeader", () => {
  it("renders brand, the three nav links, and the CTA", () => {
    const { getByLabelText, getAllByRole, getByRole } = renderAt("/about");
    expect(getByLabelText(/COR-SYS/)).toBeInTheDocument();
    const links = getAllByRole("link").map((a) => a.getAttribute("href") || "");
    expect(links.some((h) => h.endsWith("/protocol"))).toBe(true);
    expect(links.some((h) => h.endsWith("/insights"))).toBe(true);
    expect(links.some((h) => h.endsWith("/about"))).toBe(true);
    // CTA deep-links to the booking block.
    expect(getByRole("link", { name: /שיחת התאמה, 30 דקות/ }).getAttribute("href")).toContain(
      "#book"
    );
  });

  it("mobile menu toggles aria-expanded and reveals the nav panel", () => {
    const { getByRole, queryByRole } = renderAt("/insights");
    const toggle = getByRole("button", { name: /תפריט/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(queryByRole("navigation", { name: "" })).toBeDefined();
    // Panel is absent until opened.
    expect(document.getElementById("site-nav-mobile")).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById("site-nav-mobile");
    expect(panel).not.toBeNull();
    // The three links are inside the opened panel too.
    // The three nav links, the English page, then WhatsApp (2026-10-01).
    const panelLinks = within(panel as HTMLElement).getAllByRole("link");
    expect(panelLinks.length).toBe(5);
    expect(panelLinks[3].getAttribute("href")).toMatch(/\/en$/);
    expect(panelLinks[3].getAttribute("lang")).toBe("en");
    expect(panelLinks[4].getAttribute("href")).toMatch(/^https:\/\/wa\.me\/972524545963\?text=/);
    // The dark-mode switch is in the menu on phones, as a toggle button.
    const themeToggle = within(panel as HTMLElement).getByRole("button", { name: "מצב כהה" });
    expect(themeToggle.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById("site-nav-mobile")).toBeNull();
  });

  it("in English: no nav, a link back to Hebrew, the CTA on the page's own #book", () => {
    const { getByRole, queryByRole } = render(
      <MemoryRouter initialEntries={["/en"]}>
        <SiteHeader lang="en" />
      </MemoryRouter>
    );
    expect(queryByRole("link", { name: "הפרוטוקול" })).toBeNull();
    const back = getByRole("link", { name: "עברית" });
    expect(back.getAttribute("lang")).toBe("he");
    expect(getByRole("link", { name: "Fit call, 30 min" }).getAttribute("href")).toBe("#book");
    expect(getByRole("button", { name: "Dark mode" })).toBeTruthy();
  });

  it("has no detectable a11y violations (axe)", async () => {
    const { container } = renderAt("/");
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
