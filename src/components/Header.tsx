import { Calendar } from "lucide-react";
import { useCalendly } from "@/components/landing/CalendlyProvider";

const Header = () => {
  const { open } = useCalendly();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div
        dir="rtl"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
      >
        {/* Logo / Brand */}
        <a
          href="#hero"
          className="group flex items-center gap-3 outline-none"
          aria-label="COR-SYS · Protocol Ocean Blue"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-xs font-bold tracking-widest text-primary transition-colors group-hover:bg-primary/15"
          >
            CS
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-widest text-foreground">
              COR-SYS
            </span>
            <span className="mt-0.5 hidden text-[10px] tracking-[0.2em] text-muted-foreground sm:inline">
              PROTOCOL OCEAN BLUE
            </span>
          </span>
        </a>

        {/* Inline anchors (desktop only) */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#methodology"
            className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
          >
            הפרוטוקול
          </a>
          <a
            href="#pricing"
            className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
          >
            תמחור
          </a>
          <a
            href="#faq"
            className="cor-overline text-muted-foreground transition-colors hover:text-foreground"
          >
            שאלות
          </a>
        </nav>

        {/* CTA Button */}
        <button
          onClick={open}
          className="cta-warm inline-flex h-9 items-center gap-2 rounded-md px-4 font-mono text-xs font-semibold tracking-wider"
        >
          <Calendar className="h-3.5 w-3.5" />
          קבע שיחה
        </button>
      </div>
    </header>
  );
};

export default Header;
