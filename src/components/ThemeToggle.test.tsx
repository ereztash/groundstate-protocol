import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { THEME_KEY } from "@/lib/theme";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.clear();
  });

  it("starts light, even before anything is stored", () => {
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole("button", { name: "מצב כהה" }).getAttribute("aria-pressed")).toBe("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("turns dark on and off, and remembers the choice", () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole("button", { name: "מצב כהה" });

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("reflects a dark page it mounts into", () => {
    document.documentElement.classList.add("dark");
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole("button", { name: "מצב כהה" }).getAttribute("aria-pressed")).toBe("true");
  });
});
