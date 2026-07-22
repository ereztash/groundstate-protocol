import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import About from "./About";

const renderAbout = () =>
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );

describe("About accessibility", () => {
  it("has no detectable a11y violations (axe)", async () => {
    const { container } = renderAbout();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("keeps the decorative shard visual hidden from assistive tech", () => {
    const { container } = renderAbout();
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
    // Nothing focusable may hide inside the decorative layer.
    expect(
      svg!.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
        .length
    ).toBe(0);
  });

  it("renders the full story text in the DOM (scroll emphasis is visual only)", () => {
    const { getByText } = renderAbout();
    // First and last steps — dimmed steps must still be real, readable text.
    expect(getByText(/עובד סוציאלי בהכשרה/)).toBeInTheDocument();
    expect(getByText(/מסעותיו של ארז/)).toBeInTheDocument();
  });

  it("exposes exactly one h1", () => {
    const { container } = renderAbout();
    expect(container.querySelectorAll("h1").length).toBe(1);
  });
});
