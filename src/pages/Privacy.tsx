import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/**
 * Rewritten 2026-09-29 against what the form actually sends
 * (DiagnosticFormSection.tsx onSubmit, apps-script/Code.gs).
 *
 * The May version listed five fields while the payload carried nine: the
 * screening answer, the wizard's answers and free text, and the CTA that led to
 * the form were missing. It also said wizard progress "נשאר במכשירך", which was
 * true until the lead was submitted and false after, since the form reads it
 * back and sends it with the lead. Added the three things the duty to inform
 * asks for and the page did not say: that providing the data is voluntary,
 * what it is used for, and that the processors store it outside Israel.
 *
 * Retention is stated without a number on purpose. No retention period was
 * found in the operator's documents, and a page that commits to one nobody
 * decided on is the defect this repo keeps removing. The PR asks for one.
 *
 * The content wrapper became <main>: axe flagged the page for having no main
 * landmark.
 */
const Privacy = () => {
  useDocumentMeta({
    title: "מדיניות פרטיות | COR-SYS",
    description:
      "איך נאסף ומשמש מידע באתר COR-SYS: הפרטים שנמסרים בטופס, נתוני שימוש (רק לאחר אישור), והזכויות שלכם.",
    path: "/privacy",
  });

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main
        id="privacy-main"
        className="mx-auto max-w-2xl px-6 pt-28 pb-16 md:pt-32 md:pb-24"
      >
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          → חזרה לעמוד הבית
        </Link>

        <h1 className="cor-title mt-6 text-foreground">מדיניות פרטיות</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          עודכן לאחרונה: ספטמבר 2026
        </p>

        <div className="mt-10 space-y-9 text-base leading-relaxed text-foreground">
          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">מי אני</h2>
            <p>
              האתר מופעל על ידי ארז טל-שיר, עובד סוציאלי טכנולוגי ויועץ עסקי
              לעצמאים. לכל שאלה בנושא פרטיות אפשר לפנות במייל:{" "}
              <a href="mailto:erez2812345@gmail.com" className="text-link">
                erez2812345@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">איזה מידע נאסף</h2>
            <p>
              <span className="font-semibold text-foreground">
                פרטים שנמסרים בטופס:
              </span>{" "}
              שם, מספר טלפון, כתובת מייל (לא חובה), תיאור התקיעה במילים שלכם,
              התשובה לשאלה אם יש לכם עיסוק פעיל, וחלונות הזמן המועדפים לשיחה (לא
              חובה).
            </p>
            <p>
              <span className="font-semibold text-foreground">
                תשובות השאלון:
              </span>{" "}
              מי שממלאים את השאלון שממליץ מאיפה להתחיל, התשובות שלהם והטקסט
              החופשי שכתבו בו נשמרים בדפדפן. אם אחר כך שולחים את הטופס, הם נשלחים
              יחד איתו.
            </p>
            <p>
              <span className="font-semibold text-foreground">מקור ההגעה:</span>{" "}
              איזה כפתור באתר הוביל לטופס, כדי לדעת אילו חלקים בעמוד עובדים.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                נתוני שימוש (רק לאחר אישור):
              </span>{" "}
              אם אישרתם בבאנר ההסכמה, נטענים כלי ניתוח שאוספים נתונים אנונימיים
              על אופן השימוש באתר: Google Analytics 4 (עם הסתרת חלק מכתובת
              ה-IP) ו-Microsoft Clarity (מפות חום והקלטות סשן אנונימיות). בלי
              אישור, הם לא נטענים כלל.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">
              למה, ואם חובה למסור
            </h2>
            <p>
              המידע משמש כדי לחזור אליכם, לתאם שיחת התאמה ולהתכונן אליה. הוא לא
              משמש לניוזלטר, לא נמכר, ולא נמסר לאף גורם לצרכים שיווקיים.
            </p>
            <p>
              אין חובה חוקית למסור את המידע, ומסירתו תלויה ברצונכם. בלי שם וטלפון
              אי אפשר לחזור אליכם.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">
              איפה המידע נשמר ומי מעבד אותו
            </h2>
            <p>
              פרטי הטופס נשלחים דרך Google Apps Script, נשמרים בגיליון Google
              Sheets פרטי שבשליטתי, ומגיעים אליי גם כהתראה במייל. תיאום הפגישה
              נעשה ב-Calendly.
            </p>
            <ul className="list-none space-y-1.5">
              <li>
                Google (Apps Script, Sheets, Gmail, Analytics): שמירת הטופס,
                התראה, וניתוח שימוש לאחר אישור.
              </li>
              <li>Microsoft Clarity: ניתוח חוויית משתמש, רק לאחר אישור.</li>
              <li>Calendly: תיאום הפגישות.</li>
            </ul>
            <p>
              השירותים האלה שומרים מידע גם בשרתים מחוץ לישראל. לכל אחד מהם
              מדיניות פרטיות משלו, החלה בעת השימוש בשירות.
            </p>
            <p>
              המידע נשמר כל עוד הוא נחוץ למטרה שלשמה נמסר, ואפשר לבקש את מחיקתו
              בכל עת.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">
              עוגיות ואחסון מקומי
            </h2>
            <p>
              כלי הניתוח משתמשים בעוגיות, ונטענים רק לאחר אישור. בנוסף, האתר שומר
              בדפדפן (localStorage) את בחירת ההסכמה, מזהה אקראי שאינו מקושר לשם
              או לפרטים, ואת ההתקדמות בשאלון. הבחירה והמזהה נשארים במכשיר.
              ההתקדמות בשאלון נשארת במכשיר עד ששולחים את הטופס, ואז היא נשלחת
              איתו, כמתואר למעלה.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">הזכויות שלכם</h2>
            <p>
              אפשר לבקש לעיין במידע שנשמר עליכם, לתקן אותו או למחוק אותו. אפשר
              גם לשנות את הסכמת הניתוח בכל עת (ניקוי נתוני הדפדפן יציג שוב את
              באנר ההסכמה). לכל בקשה אפשר לפנות למייל למעלה, ואחזור אליכם.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">שינויים במדיניות</h2>
            <p>
              ייתכנו עדכונים למדיניות הזו מעת לעת. הגרסה העדכנית תפורסם תמיד
              בעמוד זה, עם תאריך העדכון בראשו.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Privacy;
