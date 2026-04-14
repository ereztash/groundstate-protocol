import { Button } from "@/components/ui/button";

interface HeaderProps {
  onCtaClick?: () => void;
}

const Header = ({ onCtaClick }: HeaderProps) => {
  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" dir="rtl">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="text-xl font-mono tracking-widest font-semibold text-primary">
            COR-SYS
          </div>
          <span className="text-xs text-muted-foreground font-mono">Protocol Ocean Blue</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onCtaClick}
          className="h-9 px-6 font-mono text-xs tracking-wider bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300"
        >
          התחל ספרינט
        </Button>
      </div>
    </header>
  );
};

export default Header;
