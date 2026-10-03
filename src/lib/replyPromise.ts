/**
 * When Erez answers a site lead, in words. Operator decision 2026-10-03: the
 * same business day, or the next one when the lead arrives on Friday, on
 * Saturday, or after 17:00 Israel time. Holidays are not known here; on one
 * the promise reads a day early.
 *
 * apps-script/Code.gs repeats this rule in the confirmation email it sends.
 * Change both together.
 */
const BUSINESS_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu"];
const CUTOFF_HOUR = 17;

export function replyWhen(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  return BUSINESS_DAYS.includes(day) && hour < CUTOFF_HOUR
    ? "עד סוף יום העבודה"
    : "ביום העבודה הבא";
}
