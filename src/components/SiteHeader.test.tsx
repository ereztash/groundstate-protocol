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
    // CTA deep-links to the form.
    expect(getByRole("link", { name: /בוא נדבר/ }).getAttribute("href")).toContain(
      "#diagnostic-form"
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
    expect(within(panel as HTMLElement).getAllByRole("link").length).toBe(3);

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById("site-nav-mobile")).toBeNull();
  });

  it("has no detectable a11y violations (axe)", async () => {
    const { container } = renderAt("/");
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
