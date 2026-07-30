/**
 * The commitment recorded before the results are in.
 *
 * Per operator guidance 2026-07-30. This is not evidence that the method works,
 * and nothing here may be presented as if it were. It is a commitment to
 * measure, published in advance, which is a different kind of claim.
 *
 * The reason it is worth publishing at all: a failure threshold stated before
 * the outcome is the one thing on the site that cannot be reverse-engineered
 * afterwards. Anyone copying it takes on the same exposure.
 *
 * Deliberately absent: the third-party audit line. The graph records it with an
 * open question over who that party is, and a named auditor is the whole
 * substance of such a line, so it stays out until there is a name.
 */
export const preRegistration = {
  window: {
    label: "חלון המדידה",
    value: "מפרסום ההתחייבות ועד 05/2027",
  },
  measures: {
    label: "מה נמדד",
    items: [
      "אות התעניינות מתועד, כן או לא",
      "עסקה שנסגרה, כן או לא, וסכום",
      "שינוי בחשיפות לינקדאין",
    ],
  },
  cohort: {
    label: "על מי",
    value: "20 הלקוחות הבאים, בלי יוצא מן הכלל",
  },
  reporting: {
    label: "פרסום",
    value: "דוח פתוח בתוך 12 חודשים, גם אם התוצאה שלילית",
  },
  /**
   * Stated in full, including the consequence. Softening either half would
   * remove the only part that costs anything to publish.
   */
  failureThreshold: {
    label: "סף הכישלון, נרשם מראש",
    value:
      "אם פחות מ-60% מהלקוחות מגיעים לאות התעניינות מתועד, המתודה מקבלת גרסה חדשה.",
  },
} as const;
