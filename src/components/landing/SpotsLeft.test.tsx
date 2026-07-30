import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SpotsLeft from "./SpotsLeft";

/**
 * Guards the property that made this component worth rewriting: it states a
 * standing capacity and nothing that can go stale or manufacture pressure.
 */
describe("SpotsLeft", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the standing capacity line", () => {
    render(<SpotsLeft />);
    expect(screen.getByText("אני לוקח עד 10 לקוחות בחודש.")).toBeInTheDocument();
  });

  it("performs no network request", () => {
    // The previous version read a spreadsheet cell on mount. If a fetch ever
    // reappears here, so does the possibility of publishing a stale number.
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<SpotsLeft />);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows no countdown and no remaining-slots figure", () => {
    const { container } = render(<SpotsLeft />);
    expect(container.textContent).not.toMatch(/נותרו/);
    expect(container.textContent).not.toMatch(/נתפסו/);
  });
});
