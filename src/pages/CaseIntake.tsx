import { useMemo, useState } from "react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  CHAIN_COLUMNS,
  CHAIN_COLUMN_LABEL,
  parseCaseRecord,
  type ChainColumn,
} from "@/lib/caseChain";
import { EVIDENCE_LABEL, EVIDENCE_MEANING, type EvidenceLevel } from "@/lib/evidence";

/**
 * Internal capture tool for the five chain fields, so the next client is
 * documented while it happens rather than reconstructed afterwards.
 *
 * Three deliberate properties:
 *
 *  - Nothing is transmitted. The form has no endpoint: it formats a JSON record
 *    for the operator to paste into src/data/cases/. Client detail therefore
 *    never crosses the network from this page, which is the only way to hold a
 *    tool like this on a public host.
 *  - Not indexed, and not linked from the site. It carries a noindex directive
 *    and is left out of the prerender route list, so no static HTML exists for a
 *    crawler to find.
 *  - The record it writes defaults to both publication gates closed. Capturing a
 *    case and publishing one stay separate decisions.
 *
 * The output is validated with the same parser the site uses before it is
 * offered for copying, so a record that would be silently dropped at runtime is
 * reported here instead.
 */

const LEVELS: EvidenceLevel[] = ["anchored", "operator", "pending"];

const HINTS: Record<ChainColumn, string> = {
  said: "מה הלקוח אמר בפתיחה, בניסוח שלו, בלי פרט מזהה.",
  identified: "התבנית שזוהתה מתחת לחומר הגולמי.",
  created: "התוצר שנוצר בפועל.",
  done: "הפעולה שהלקוח ביצע בעקבות התוצר.",
  happened: "מה קרה אחר כך, כולל מקרה שבו לא קרה דבר.",
};

const CaseIntake = () => {
  useDocumentMeta({
    title: "קליטת מקרה, כלי פנימי",
    robots: "noindex,nofollow",
  });

  const [id, setId] = useState("");
  const [subjectLabel, setSubjectLabel] = useState("מומחה תחום נישתי");
  const [outcome, setOutcome] = useState<"converted" | "not_converted">(
    "converted",
  );
  const [rule, setRule] = useState("");
  const [caveats, setCaveats] = useState("n=1. מקרה אחד אינו שיטה מוכחת.");
  const [cells, setCells] = useState<
    Record<ChainColumn, { text: string; level: EvidenceLevel }>
  >(() =>
    Object.fromEntries(
      CHAIN_COLUMNS.map((c) => [c, { text: "", level: "operator" as EvidenceLevel }]),
    ) as Record<ChainColumn, { text: string; level: EvidenceLevel }>,
  );
  const [copied, setCopied] = useState(false);

  const record = useMemo(
    () => ({
      id: id.trim() || "C?",
      // Both gates closed. Publishing is a separate decision, taken later.
      consent_state: "pending" as const,
      source_integrity_confirmed: false,
      outcome,
      subject_label: subjectLabel.trim(),
      niche_generalized: true,
      pre_registered_rule: rule.trim() ? rule.trim() : null,
      chain: CHAIN_COLUMNS.map((c) => ({
        column: c,
        text: cells[c].text.trim(),
        evidence_level: cells[c].level,
      })),
      caveats: caveats
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    }),
    [id, subjectLabel, outcome, rule, caveats, cells],
  );

  const json = useMemo(() => JSON.stringify(record, null, 2), [record]);
  const valid = useMemo(() => parseCaseRecord(record) !== null, [record]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-3xl">
        <p className="cor-overline-he">כלי פנימי</p>
        <h1 className="cor-title mt-2">קליטת מקרה</h1>
        <p className="cor-body-lg mt-4 text-foreground/80">
          חמשת השדות של שרשרת הראיה. הטופס לא שולח לשום מקום: הוא מרכיב רשומה
          שאפשר להעתיק לתיקיית המקרים. שני שערי הפרסום נשארים סגורים בברירת מחדל.
        </p>

        <div className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">מזהה</span>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="C14"
                className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-base"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">תיאור כללי של הנושא</span>
              <input
                value={subjectLabel}
                onChange={(e) => setSubjectLabel(e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-base"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                בלי שם, ובלי פרט שמזהה בשוק קטן.
              </span>
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">תוצאה</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {(
                [
                  { v: "converted", l: "המיר" },
                  { v: "not_converted", l: "לא המיר" },
                ] as const
              ).map((o) => (
                <label
                  key={o.v}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    outcome === o.v ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    checked={outcome === o.v}
                    onChange={() => setOutcome(o.v)}
                    className="h-4 w-4"
                  />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-semibold">
              הכלל שנרשם לפני שהתוצאה היתה ידועה
            </span>
            <textarea
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-base"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              חובה בפועל עבור מקרה שלא המיר. בלעדיו אין דרך להראות שהכלל לא נבחר
              בדיעבד.
            </span>
          </label>

          {CHAIN_COLUMNS.map((col, i) => (
            <div key={col} className="rounded-lg border border-border p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                <span className="text-sm font-semibold">
                  {CHAIN_COLUMN_LABEL[col]}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{HINTS[col]}</p>
              <textarea
                value={cells[col].text}
                onChange={(e) =>
                  setCells((p) => ({
                    ...p,
                    [col]: { ...p[col], text: e.target.value },
                  }))
                }
                rows={2}
                className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-base"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {LEVELS.map((lv) => (
                  <label
                    key={lv}
                    title={EVIDENCE_MEANING[lv]}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs ${
                      cells[col].level === lv
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`level-${col}`}
                      checked={cells[col].level === lv}
                      onChange={() =>
                        setCells((p) => ({
                          ...p,
                          [col]: { ...p[col], level: lv },
                        }))
                      }
                      className="h-3.5 w-3.5"
                    />
                    {EVIDENCE_LABEL[lv]}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label className="block">
            <span className="text-sm font-semibold">
              מה המקרה הזה לא אומר, שורה לכל הסתייגות
            </span>
            <textarea
              value={caveats}
              onChange={(e) => setCaveats(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-base"
            />
          </label>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copy}
              disabled={!valid}
              className="cta-action inline-flex h-11 items-center rounded-md px-5 text-sm disabled:opacity-50"
            >
              {copied ? "הועתק" : "העתק רשומה"}
            </button>
            <span
              role="status"
              className={`text-sm ${valid ? "text-muted-foreground" : "text-destructive"}`}
            >
              {valid
                ? "הרשומה תקפה. הדבק אותה לקובץ חדש תחת src/data/cases."
                : "הרשומה עדיין חסרה שדה. כל חמשת השלבים והתיאור הכללי נדרשים."}
            </span>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-card p-4 text-left text-xs leading-relaxed">
            <code dir="ltr">{json}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CaseIntake;
