const LandingFooter = () => {
  return (
    <footer
      dir="rtl"
      className="border-t border-border bg-background py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-foreground">
              ארז טל-שיר
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              מומחה במטא-תהליכים. עובד סוציאלי טכנולוגי-עסקי.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="#sequence"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              הרצף
            </a>
            <a
              href="#full-package"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              תמחור
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              שאלות
            </a>
            <a
              href="#diagnostic-form"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              אבחון
            </a>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          COR-SYS 2026
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
