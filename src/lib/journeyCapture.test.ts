import { describe, it, expect } from "vitest";
import {
  assertCleanPayload,
  PayloadError,
  type JourneyPayload,
} from "./journeyCapture";

/**
 * The point of these tests is that a future edit which adds "just a bit of
 * context" to the analytics payload fails here rather than shipping a visitor's
 * own words to an analytics vendor.
 */

const clean: JourneyPayload = {
  journey_ref: "a1b2c3d4e5f6",
  stage: "lead_capture",
  event: "completed",
  evidence_type: "observed",
  outcome_type: "qualified",
  summary_code: "form_submitted",
};

describe("assertCleanPayload", () => {
  it("accepts a payload of enums and an opaque ref", () => {
    expect(() => assertCleanPayload(clean)).not.toThrow();
  });

  it("rejects a free-text field, whatever it is called", () => {
    for (const key of ["summary", "note", "challenge", "message", "name"]) {
      const dirty = { ...clean, [key]: "הידע שלי מבוסס אבל ההצעה לא" };
      expect(() =>
        assertCleanPayload(dirty as unknown as JourneyPayload)
      ).toThrow(PayloadError);
    }
  });

  it("rejects a price, even a numeric one", () => {
    const withPrice = { ...clean, price: 1900 };
    expect(() =>
      assertCleanPayload(withPrice as unknown as JourneyPayload)
    ).toThrow(PayloadError);
  });

  it("rejects prose smuggled into an enum field", () => {
    const dirty = { ...clean, summary_code: "the visitor said it was too much" };
    expect(() =>
      assertCleanPayload(dirty as unknown as JourneyPayload)
    ).toThrow(PayloadError);
  });

  it("rejects a journey_ref that carries meaning", () => {
    // Anything that is not 12 hex characters could encode an identifier.
    for (const ref of ["erez-2026", "0501234567", "", "a1b2c3", "A1B2C3D4E5F6"]) {
      expect(() =>
        assertCleanPayload({ ...clean, journey_ref: ref })
      ).toThrow(PayloadError);
    }
  });

  it("rejects a payload missing a required field", () => {
    const { outcome_type, ...missing } = clean;
    void outcome_type;
    expect(() =>
      assertCleanPayload(missing as unknown as JourneyPayload)
    ).toThrow(PayloadError);
  });

  it("rejects an out-of-enum stage rather than passing it through", () => {
    expect(() =>
      assertCleanPayload({
        ...clean,
        stage: "m0" as unknown as JourneyPayload["stage"],
      })
    ).toThrow(PayloadError);
  });
});

describe("example export", () => {
  it("a full sample record validates", () => {
    // Stands in for the sample export file the guidance asks to validate. Every
    // enum value is exercised at least once across these combinations.
    const samples: JourneyPayload[] = [
      { ...clean, stage: "exposure", event: "reached", evidence_type: "self_report", outcome_type: "unknown", summary_code: "evidence_seen" },
      { ...clean, stage: "interest", event: "started", summary_code: "wizard_started" },
      { ...clean, stage: "interest", event: "completed", summary_code: "wizard_completed" },
      { ...clean, stage: "lead_capture", event: "started", summary_code: "form_reached" },
      { ...clean, stage: "lead_capture", event: "completed", summary_code: "form_step_one_done" },
      { ...clean, stage: "fit", event: "abandoned", outcome_type: "unqualified", summary_code: "screen_active_practice_no" },
      { ...clean, stage: "fit", event: "completed", evidence_type: "ledger", summary_code: "screen_active_practice_yes" },
      { ...clean, stage: "exposure", event: "reached", summary_code: "pricing_seen" },
    ];
    for (const s of samples) {
      expect(() => assertCleanPayload(s)).not.toThrow();
    }
  });
});
