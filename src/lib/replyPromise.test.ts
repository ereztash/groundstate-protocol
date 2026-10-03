import { describe, it, expect } from "vitest";
import { replyWhen } from "./replyPromise";

const SAME = "עד סוף יום העבודה";
const NEXT = "ביום העבודה הבא";

describe("replyWhen", () => {
  // October 2026 is summer time in Israel (UTC+3); December is winter (UTC+2).
  it("promises the same day on a business day before 17:00", () => {
    expect(replyWhen(new Date("2026-10-04T07:00:00Z"))).toBe(SAME); // Sun 10:00
    expect(replyWhen(new Date("2026-10-08T13:59:00Z"))).toBe(SAME); // Thu 16:59
    expect(replyWhen(new Date("2026-12-06T08:00:00Z"))).toBe(SAME); // Sun 10:00, winter
  });

  it("promises the next business day from 17:00", () => {
    expect(replyWhen(new Date("2026-10-08T14:00:00Z"))).toBe(NEXT); // Thu 17:00
    expect(replyWhen(new Date("2026-12-10T15:30:00Z"))).toBe(NEXT); // Thu 17:30, winter
  });

  it("promises the next business day on Friday and Saturday", () => {
    expect(replyWhen(new Date("2026-10-09T07:00:00Z"))).toBe(NEXT); // Fri 10:00
    expect(replyWhen(new Date("2026-10-10T09:00:00Z"))).toBe(NEXT); // Sat 12:00
  });

  it("reads the day in Israel, not UTC", () => {
    // Sat 22:30 UTC is already Sunday 01:30 in Israel: a business day, before 17:00.
    expect(replyWhen(new Date("2026-10-10T22:30:00Z"))).toBe(SAME);
  });
});
