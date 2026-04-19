import { CALENDLY_URL } from "@/lib/calendly";

const LandingFooter = () => {
  return (
    <footer
      dir="rtl"
      className="border-t border-border/60 bg-background py-10"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-widest text-primary">
                COR-SYS
              </span>
              <span className="cor-overline text-muted-foreground">
                · Protocol Ocean Blue
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              המנסרה · שלוש שאלות שאתה שואל בכל יום שני — עד שלקוח ראשון מחזיר במייל.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
            >
              קבע שיחה
            </a>
            <span className="h-1 w-1 rounded-full bg-border" />
            <a
              href="#methodology"
              className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
            >
              הפרוטוקול
            </a>
            <span className="h-1 w-1 rounded-full bg-border" />
            <a
              href="#booking"
              className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
            >
              Booking
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center font-mono text-xs text-muted-foreground">
          © 2026 COR-SYS. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
