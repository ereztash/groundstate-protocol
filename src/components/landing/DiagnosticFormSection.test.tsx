import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import DiagnosticFormSection from "./DiagnosticFormSection";
import { DiagnosticFormProvider } from "./DiagnosticFormProvider";
import { submitForm } from "@/lib/web3forms";

// The revenue path. These tests drive the two-step lead form end to end with
// the network stubbed, so a regression in validation, step progression, the
// submitted payload, or the success state fails CI instead of silently
// dropping leads in production.

// Stub the form backend so no real POST hits the Apps Script endpoint.
vi.mock("@/lib/web3forms", () => ({
  submitForm: vi.fn(),
}));

// SpotsLeft fires a live fetch on mount; null = render the static line, no net.
vi.mock("@/lib/spots", () => ({
  useSpotsLeft: () => null,
}));

// BookingSection is a lazy Calendly embed shown after success — stub it so the
// test doesn't pull external scripts.
vi.mock("./BookingSection", () => ({
  default: () => <div data-testid="booking-section" />,
}));

beforeAll(() => {
  // framer-motion's whileInView (Reveal) needs IntersectionObserver; jsdom
  // lacks it. A no-op observer is enough — children always render regardless.
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = IO;

  // Radix Checkbox (step-2 time windows) measures itself via ResizeObserver,
  // also absent in jsdom.
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error jsdom has no ResizeObserver
  global.ResizeObserver = RO;

  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  vi.clearAllMocks();
});

function renderForm() {
  return render(
    <DiagnosticFormProvider>
      <DiagnosticFormSection />
    </DiagnosticFormProvider>
  );
}

async function completeStepOne() {
  fireEvent.change(screen.getByPlaceholderText(/לדוגמה/), {
    target: { value: "יש לי 15 שנות ניסיון אבל אין פניות" },
  });
  fireEvent.change(screen.getByLabelText(/איך לקרוא לך/), {
    target: { value: "ישראל ישראלי" },
  });
  fireEvent.click(screen.getByRole("button", { name: "המשך" }));
  // Step 2 is reached only once step 1 validates and submits.
  return screen.findByPlaceholderText("05X-XXXXXXX");
}

describe("DiagnosticFormSection", () => {
  it("completes both steps, submits, and shows the booking confirmation", async () => {
    vi.mocked(submitForm).mockResolvedValue({ success: true, message: "ok" });

    renderForm();
    const phone = await completeStepOne();

    fireEvent.change(phone, { target: { value: "0501234567" } });
    fireEvent.click(screen.getByRole("button", { name: /שלח/ }));

    // Success heading replaces the form.
    expect(
      await screen.findByText("תודה. בוא נקבע את הפגישה.")
    ).toBeInTheDocument();

    // The payload that reaches the backend carries the step-1 + step-2 data,
    // with the documented "(לא מולא)" / "(נקבע בשיחה)" fallbacks.
    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "ישראל ישראלי",
        phone: "0501234567",
        challenge: "יש לי 15 שנות ניסיון אבל אין פניות",
        stage: "(נקבע בשיחה)",
        email: "(לא מולא)",
        preferredTimes: ["(לא מולא)"],
      })
    );
  });

  it("rejects an invalid Israeli phone and does not submit", async () => {
    renderForm();
    const phone = await completeStepOne();

    fireEvent.change(phone, { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /שלח/ }));

    expect(await screen.findByText("מספר טלפון לא תקין")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("blocks step 1 until the challenge and name are valid", async () => {
    renderForm();

    // Submit step 1 empty — validation should keep us on step 1 (no phone field).
    fireEvent.click(screen.getByRole("button", { name: "המשך" }));

    expect(await screen.findByText("כתוב/י משפט אחד")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("05X-XXXXXXX")).not.toBeInTheDocument();
  });
});
