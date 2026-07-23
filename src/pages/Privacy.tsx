import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Privacy = () => {
  useDocumentMeta({
    title: "מדיניות פרטיות | COR-SYS",
    description:
      "איך נאסף ומשמש מידע באתר COR-SYS: פרטים שאתה מוסר בטופס, נתוני שימוש (רק לאחר אישורך), וזכויותיך.",
    path: "/privacy",
  });

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          → חזרה לעמוד הבית
        </Link>

        <h1 className="cor-title mt-6 text-foreground">מדיניות פרטיות</h1>
        <p className="mt-2 text-sm text-muted-foreground">עודכן לאחרונה: מאי 2026</p>

        <div className="mt-10 space-y-9 text-[15px] leading-relaxed text-foreground/85">
          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">מי אני</h2>
            <p>
              האתר מופעל על ידי ארז טל-שיר, יועץ עסקי לעצמאים. לכל שאלה בנושא
              פרטיות אפשר לפנות במייל:{" "}
              <a href="mailto:erez2812345@gmail.com" className="text-link">
                erez2812345@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">איזה מידע נאסף</h2>
            <p>
              <span className="font-semibold text-foreground">פרטים שאתה מוסר בטופס:</span>{" "}
              שם, מספר טלפון, כתובת מייל (אופציונלי), תיאור התקיעה שכתבת, וחלונות
              הזמן המועדפים. המידע משמש אך ורק כדי לחזור אליך ולתאם שיחה.
            </p>
            <p>
              <span className="font-semibold text-foreground">נתוני שימוש (רק לאחר אישורך):</span>{" "}
              אם אישרת בבאנר ההסכמה, נטענים כלי ניתוח שאוספים נתונים אנונימיים על
              אופן השימוש באתר — Google Analytics 4 (עם הסתרת חלק מכתובת ה-IP)
              ו-Microsoft Clarity (מפות חום והקלטות סשן אנונימיות). בלי אישור — הם
              אינם נטענים כלל.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">איך המידע נשמר</h2>
            <p>
              פרטי הטופס נשלחים דרך Google Apps Script ונשמרים בגיליון Google
              Sheets פרטי שבשליטתי. הם אינם נמכרים ואינם משותפים עם צד שלישי
              לצרכים שיווקיים.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">שירותי צד שלישי</h2>
            <ul className="list-none space-y-1.5">
              <li>— Google (Analytics, Apps Script, Sheets) — איסוף נתונים ושמירת הטופס.</li>
              <li>— Microsoft Clarity — ניתוח חוויית משתמש (רק לאחר אישור).</li>
              <li>— Calendly — תיאום הפגישות.</li>
            </ul>
            <p>לכל אחד מהם מדיניות פרטיות משלו, החלה בעת השימוש בשירות.</p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">עוגיות ואחסון מקומי</h2>
            <p>
              כלי הניתוח עושים שימוש בעוגיות, ונטענים רק לאחר שאישרת. בנוסף,
              האתר שומר העדפות מקומיות בדפדפן שלך (localStorage) — למשל בחירת
              ההסכמה והתקדמות בשאלון — כדי לשפר את החוויה. מידע זה נשאר במכשירך.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">הזכויות שלך</h2>
            <p>
              אתה רשאי לבקש לעיין במידע שנשמר עליך, לתקן אותו או למחוק אותו. אפשר
              גם לשנות את הסכמת הניתוח בכל עת (ניקוי נתוני הדפדפן יציג שוב את באנר
              ההסכמה). לכל בקשה — פנה למייל למעלה ואחזור אליך.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="cor-subheading text-foreground">שינויים במדיניות</h2>
            <p>
              ייתכנו עדכונים למדיניות הזו מעת לעת. הגרסה העדכנית תפורסם תמיד בעמוד
              זה, עם תאריך העדכון בראשו.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Privacy;
