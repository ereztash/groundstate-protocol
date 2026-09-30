import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/**
 * Accessibility statement (הצהרת נגישות), added 2026-09-29.
 *
 * Every measure listed under "מה נעשה" is one that exists in this repo and can
 * be checked: the skip links, the reduced-motion handling, the captions track
 * on the video testimonial, alt text, the axe suites that run in CI. The known
 * limitations are the ones axe and a manual pass found on the live pages the
 * same day. A statement that claimed full conformance would be the kind of
 * unsupported claim the rest of the site is built to refuse.
 *
 * Whether the statutory duty applies to a business of this size is a legal
 * question for the operator; the page is right to have either way.
 */
const Accessibility = () => {
  useDocumentMeta({
    title: "הצהרת נגישות | COR-SYS",
    description:
      "הצהרת הנגישות של אתר COR-SYS: רמת הנגישות, מה נעשה, מגבלות ידועות, ודרכי פנייה בנושא נגישות.",
    path: "/accessibility",
  });

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main
        id="accessibility-main"
        className="mx-auto max-w-2xl px-6 pt-28 pb-16 md:pt-32 md:pb-24"
      >
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          → חזרה לעמוד הבית
        </Link>

        <h1 className="cor-title mt-6 text-foreground">הצהרת נגישות</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          עודכן לאחרונה: ספטמבר 2026
        </p>

        <div className="mt-10 space-y-9 text-base leading-relaxed text-foreground">
          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">רמת הנגישות</h2>
            <p>
              האתר נבנה במטרה לעמוד בתקן הישראלי ת״י 5568, המבוסס על הנחיות
              WCAG 2.0, ברמה AA. האתר עברי ומוצג מימין לשמאל.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">מה נעשה</h2>
            <ul className="list-disc space-y-1.5 ps-5">
              <li>קישור ״דילוג לתוכן״ בראש העמודים, לניווט מהיר במקלדת.</li>
              <li>
                כיבוד הגדרת ״הפחתת תנועה״ של מערכת ההפעלה: האנימציות מצטמצמות או
                נעצרות.
              </li>
              <li>כתוביות בעברית לעדות הווידאו.</li>
              <li>טקסט חלופי לתמונות, ומבנה כותרות היררכי בכל עמוד.</li>
              <li>
                בדיקות נגישות אוטומטיות (axe) שרצות על חלק מהעמודים בכל שינוי
                בקוד.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">מגבלות ידועות</h2>
            <p>
              בבדיקה שנעשתה בספטמבר 2026 נמצאו כמה פריטים שעדיין לא עומדים בתקן
              במלואו, והם בטיפול:
            </p>
            <ul className="list-disc space-y-1.5 ps-5">
              <li>
                חלק מהתוויות הקטנות (10 עד 11 פיקסלים) בגוון נחושת, שהניגודיות
                שלהן גבולית.
              </li>
              <li>
                כפתורי הערות השוליים קטנים מ-24 פיקסלים, ולכן קשים ללחיצה במסך
                מגע.
              </li>
              <li>
                בעמוד הפרוטוקול, שלבים שעוד לא הגיעו אליהם בגלילה מוצגים בגוון
                חיוור.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">פנייה בנושא נגישות</h2>
            <p>
              נתקלתם בקושי, או במשהו שלא עובד כמו שצריך? אפשר לכתוב לי, ארז
              טל-שיר, במייל{" "}
              <a href="mailto:erez2812345@gmail.com" className="text-link">
                erez2812345@gmail.com
              </a>
              , עם תיאור הבעיה והעמוד שבו היא הופיעה. אחזור אליכם ואטפל בזה.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Accessibility;
