import { useRef } from "react";
import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";

const Landing = () => {
  const signupRef = useRef<HTMLDivElement>(null);

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header onCtaClick={scrollToSignup} />

      {/* Section 1: Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden" dir="rtl">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10 animate-slow-fade-in">
          <div className="space-y-4">
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary">
              פרוטוקול אוקיינוס כחול
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              הבידול שלך מתחיל באינטגרציה
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              לעצמאים ואינטגרטורים שמחזיקים שתי דיסציפלינות בראש אחד ולא יודעים איך למכור את זה.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={scrollToSignup}
              className="h-12 px-8 font-mono text-sm tracking-wider bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300 rounded-lg inline-block"
            >
              התחל ספרינט 30 ימים
            </button>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            ₪2,500 - פרוטוקול 4 פגישות - תוצאות מדודות
          </p>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="py-20 px-6 bg-muted/20 relative" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="space-y-6 animate-slow-fade-in">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-primary mb-4">
                  הבעיה
                </p>
                <h2 className="text-3xl font-bold text-foreground">
                  הפער שאף אחד לא מדבר עליו
                </h2>
              </div>

              <p className="text-base text-foreground/80 leading-relaxed">
                ב-Israel קיימים יועצי טכנולוגיה, יועצי תרבות, ויועצי AI. אך אין שחקן שמחזיק את השלוש בו-זמנית עם מוצר ממוצר וגישה מדודה.
              </p>

              <p className="text-base text-foreground/80 leading-relaxed">
                אתה — עובד סוציאלי שיודע לקוד, או מאמן עם יכולת להנדס מערכות, או מהנדס עם הבנה פסיכו-חברתית — אתה מסתתר את הדיסציפלינה השנייה.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed font-mono">
                וזה כוחך הגדול ביותר.
              </p>
            </div>

            {/* Visual element - three circles */}
            <div className="hidden md:flex items-center justify-center">
              <div className="space-y-6 w-full">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-background/50">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-mono text-sm text-foreground">פסיכולוגיה ארגונית</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-background/50">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-mono text-sm text-foreground">הנדסה טכנולוגית</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-background/50">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-mono text-sm text-foreground">עסקים מדודים</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Sprint 30 */}
      <section className="py-20 px-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-slow-fade-in">
            <p className="text-xs font-mono tracking-widest uppercase text-primary mb-4">
              נקודת הכניסה שלך
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ספרינט 30 ימים
            </h2>
            <p className="text-base text-muted-foreground">
              ארבע פגישות שיוציאו מהסתתר את הכוח שלך ויהפכו אותו ללקוח.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Timeline / Sessions */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground mb-6">
                ארבע פגישות
              </h3>

              <div className="space-y-4">
                {[
                  { day: "יום 1-3", title: "אבחון בידול", desc: "זיהוי החפיר התחרותי והדיסציפלינות הנסתרות" },
                  { day: "יום 8", title: "הנדסת הצעה", desc: "המרת המומחיות להצעה ממוצרת עם תמחור" },
                  { day: "יום 15-20", title: "אדריכלות דאטא", desc: "איתור לקוחות אידיאליים ומילון כאב" },
                  { day: "יום 22-30", title: "אינטגרציה", desc: "שלוש פניות שנשלחו, אות שוק ראשון" },
                ].map((session, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-border/40 last:border-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-8 bg-border/40 my-1" />
                    </div>
                    <div className="pb-2">
                      <p className="text-xs font-mono text-muted-foreground">{session.day}</p>
                      <p className="font-semibold text-foreground">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{session.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key metrics */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground mb-6">
                מה אתה מקבל
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                  <p className="text-xs font-mono text-primary mb-1">זמן לערך פסיכולוגי</p>
                  <p className="text-2xl font-bold text-foreground">יום 8</p>
                  <p className="text-xs text-muted-foreground">מרגע ההתחלה עד שאתה מרגיש את השינוי</p>
                </div>

                <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                  <p className="text-xs font-mono text-primary mb-1">זמן לאות שוק</p>
                  <p className="text-2xl font-bold text-foreground">יום 30</p>
                  <p className="text-xs text-muted-foreground">שלוש פניות שנשלחו ודברו חזרה</p>
                </div>

                <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                  <p className="text-xs font-mono text-primary mb-1">תמחור</p>
                  <p className="text-2xl font-bold text-foreground">₪2,500-4,000</p>
                  <p className="text-xs text-muted-foreground">Founding tier - עם זכויות case study</p>
                </div>

                <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                  <p className="text-xs font-mono text-primary mb-1">Upside</p>
                  <p className="text-2xl font-bold text-foreground">Integration 60</p>
                  <p className="text-xs text-muted-foreground">אם אות השוק מגיע, אנחנו מציעים המשך</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA / Signup */}
      <section
        ref={signupRef}
        className="min-h-screen flex items-center justify-center px-6 py-20 bg-muted/10"
        dir="rtl"
      >
        <div className="max-w-md w-full">
          <div className="text-center mb-12 animate-slow-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              מוכן להתחיל?
            </h2>
            <p className="text-base text-muted-foreground">
              השאר פרטים. נחזור אליך בעוד 24 שעות להתחזק את הספרינט.
            </p>
          </div>

          <SignupForm onSubmitSuccess={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-8 px-6" dir="rtl">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground font-mono">
          <p>© 2026 COR-SYS. Protocol Ocean Blue. בנוי עבור עצמאיים שמחזיקים את השלוש.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
