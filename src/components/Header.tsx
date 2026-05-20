import { trackCtaClick } from "@/lib/analytics";

const scrollToForm = () => {
  trackCtaClick("header_diagnostic");
  document
    .getElementById("diagnostic-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div
        dir="rtl"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
      >
        <a
          href="#hero"
          className="group flex items-center gap-2 outline-none"
          aria-label="COR-SYS"
        >
          <span className="text-base font-semibold tracking-wide text-foreground">
            COR-SYS
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
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
        </nav>

        <button
          type="button"
          onClick={scrollToForm}
          className="cta-line inline-flex h-9 items-center gap-2 rounded-md px-3.5 text-xs font-semibold md:px-4 md:text-sm"
        >
          בוא נדבר
        </button>
      </div>
    </header>
  );
};

export default Header;
