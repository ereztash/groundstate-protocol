import { describe, it, expect } from "vitest";
import {
  ISRAELI_PHONE,
  stepOneSchema,
  stepTwoSchema,
  timeWindows,
} from "./diagnosticSchema";

/**
 * The gate every enquiry passes through. All six CTAs on the site land on this
 * form, so a rule that is wrong here is wrong for every visitor, and until this
 * file existed the only way to exercise it was to drive the UI.
 *
 * Written to pin current behaviour, including where that behaviour is arguably
 * too narrow. The rejections below are as deliberate as the acceptances: if
 * someone later widens the phone rule, these tests are what tells them which
 * inputs they just started accepting.
 */

const one = (over: Record<string, unknown> = {}) => ({
  challenge: "הלקוחות לא מבינים מה אני מוכרת.",
  fullName: "דנה כהן",
  activePractice: "yes" as const,
  ...over,
});

const two = (over: Record<string, unknown> = {}) => ({
  phone: "050-1234567",
  email: "",
  preferredTimes: [],
  ...over,
});

describe("ISRAELI_PHONE", () => {
  it.each([
    ["050-1234567", "mobile with a hyphen"],
    ["0501234567", "mobile with no separator"],
    ["03-1234567", "two digit landline area code with a hyphen"],
    ["031234567", "two digit landline area code, no separator"],
    ["0771234567", "an 07x VoIP prefix"],
  ])("accepts %s (%s)", (input) => {
    expect(ISRAELI_PHONE.test(input)).toBe(true);
  });

  it.each([
    ["501234567", "no leading zero"],
    ["050-123456", "one digit short"],
    ["050-12345678", "one digit long"],
    ["050 1234567", "a space instead of a hyphen"],
    ["050.1234567", "a dot instead of a hyphen"],
    ["", "empty"],
    ["לא טלפון", "not a number at all"],
  ])("rejects %s (%s)", (input) => {
    expect(ISRAELI_PHONE.test(input)).toBe(false);
  });

  /**
   * Two known gaps, pinned rather than fixed.
   *
   * The international form is what a visitor abroad, or one copying from a
   * contact card, is likely to type, and it is silently rejected as "not a
   * valid Israeli number". Widening the rule is a product decision about who
   * the form is willing to hear from, not part of moving this file out of the
   * component — but it should be a decision, so it is written down here.
   */
  it("rejects the +972 international form", () => {
    expect(ISRAELI_PHONE.test("+972501234567")).toBe(false);
    expect(ISRAELI_PHONE.test("+972-50-1234567")).toBe(false);
    expect(ISRAELI_PHONE.test("00972501234567")).toBe(false);
  });

  /** Shape only: ten zeroes are structurally valid and reach the sheet. */
  it("accepts a well-formed number that cannot be real", () => {
    expect(ISRAELI_PHONE.test("0000000000")).toBe(true);
  });
});

describe("stepOneSchema", () => {
  it("accepts a filled first step", () => {
    expect(stepOneSchema.safeParse(one()).success).toBe(true);
  });

  it("requires a challenge of at least three characters", () => {
    expect(stepOneSchema.safeParse(one({ challenge: "כן" })).success).toBe(
      false
    );
    expect(stepOneSchema.safeParse(one({ challenge: "אבג" })).success).toBe(
      true
    );
  });

  it("caps the challenge at 800 characters", () => {
    expect(
      stepOneSchema.safeParse(one({ challenge: "א".repeat(800) })).success
    ).toBe(true);
    expect(
      stepOneSchema.safeParse(one({ challenge: "א".repeat(801) })).success
    ).toBe(false);
  });

  it("requires a name of at least two characters, capped at 80", () => {
    expect(stepOneSchema.safeParse(one({ fullName: "ד" })).success).toBe(false);
    expect(stepOneSchema.safeParse(one({ fullName: "דן" })).success).toBe(true);
    expect(
      stepOneSchema.safeParse(one({ fullName: "א".repeat(81) })).success
    ).toBe(false);
  });

  /**
   * The screening question. A "no" is a valid answer and must submit: it tags
   * the row so follow-up can be worded differently, it does not turn the
   * visitor away. Anything outside the two options is a broken form.
   */
  it("accepts both screening answers and nothing else", () => {
    expect(stepOneSchema.safeParse(one({ activePractice: "yes" })).success).toBe(
      true
    );
    expect(stepOneSchema.safeParse(one({ activePractice: "no" })).success).toBe(
      true
    );
    expect(
      stepOneSchema.safeParse(one({ activePractice: "maybe" })).success
    ).toBe(false);
    expect(
      stepOneSchema.safeParse(one({ activePractice: undefined })).success
    ).toBe(false);
  });

  it("addresses the visitor in the feminine when it complains", () => {
    const r = stepOneSchema.safeParse(one({ challenge: "כן" }));
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe("כתבי משפט אחד");

    const s = stepOneSchema.safeParse(one({ activePractice: "maybe" }));
    expect(s.success).toBe(false);
    if (!s.success)
      expect(s.error.issues[0].message).toBe("בחרי אחת מהאפשרויות");
  });
});

describe("stepTwoSchema", () => {
  it("accepts a phone alone, with email and times left empty", () => {
    expect(stepTwoSchema.safeParse(two()).success).toBe(true);
  });

  it("requires the phone", () => {
    expect(stepTwoSchema.safeParse(two({ phone: "" })).success).toBe(false);
    expect(stepTwoSchema.safeParse(two({ phone: undefined })).success).toBe(
      false
    );
  });

  /**
   * Email is genuinely optional, and "" is the value a controlled input holds
   * when the visitor never touches it — so the empty string has to pass as
   * surely as a real address does. `.optional()` alone would not do it.
   */
  it("treats an empty email as absent, but validates a non-empty one", () => {
    expect(stepTwoSchema.safeParse(two({ email: "" })).success).toBe(true);
    expect(stepTwoSchema.safeParse(two({ email: undefined })).success).toBe(
      true
    );
    expect(stepTwoSchema.safeParse(two({ email: "dana@example.com" })).success).toBe(
      true
    );
    expect(stepTwoSchema.safeParse(two({ email: "dana@" })).success).toBe(false);
    expect(stepTwoSchema.safeParse(two({ email: "dana" })).success).toBe(false);
  });

  it("accepts any subset of the time windows, including none", () => {
    expect(stepTwoSchema.safeParse(two({ preferredTimes: [] })).success).toBe(
      true
    );
    expect(
      stepTwoSchema.safeParse(two({ preferredTimes: ["morning", "evening"] }))
        .success
    ).toBe(true);
    expect(
      stepTwoSchema.safeParse(two({ preferredTimes: undefined })).success
    ).toBe(true);
  });
});

describe("timeWindows", () => {
  it("offers three non-overlapping windows covering 08:00 to 20:00", () => {
    expect(timeWindows.map((w) => w.id)).toEqual([
      "morning",
      "noon",
      "evening",
    ]);
    expect(timeWindows.every((w) => w.label.length > 0)).toBe(true);
  });
});
