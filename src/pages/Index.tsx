import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAmbientSound } from "@/hooks/use-ambient-sound";

const crisisWords = [
  "רוצה למות", "אסיים הכול", "אין טעם", "להתאבד",
  "suicide", "kill myself", "end it all"
];

type AppState = "entry" | "deconstruction" | "grounding" | "resolution" | "crisis";

const GROUNDING_STEPS = [
  { count: 5, sense: "ראייה",  verb: "רואה",   hint: "צבעים, צורות, פרטים קטנים" },
  { count: 4, sense: "מגע",    verb: "מרגיש", hint: "לחץ, חום, מרקם של בגד" },
  { count: 3, sense: "שמיעה", verb: "שומע",   hint: "צלילים קרובים ורחוקים" },
  { count: 2, sense: "ריח",   verb: "מריח",   hint: "אוויר, עור, סביבה" },
  { count: 1, sense: "טעם",   verb: "טועם",   hint: "מה שיש כרגע בפה" },
];

const SafetyScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
    <div className="max-w-lg w-full space-y-10 animate-slow-fade-in" dir="rtl">
      <div className="space-y-4 text-center">
        <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-destructive/80">
          עצירה
        </p>
        <h2 className="font-display text-3xl text-foreground leading-tight">
          זה לא רגע לכלי דיגיטלי.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          מה שכתבת מצביע על מצוקה שדורשת אדם, לא ממשק.
          <br />
          הקווים למטה מאוישים עכשיו, חינם, בעברית.
        </p>
      </div>
      <div className="space-y-3">
        <a
          href="tel:1201"
          className="flex items-baseline justify-between rounded-lg border border-destructive/40 bg-destructive/5 px-5 py-4 hover:bg-destructive/10 transition-colors"
        >
          <span className="text-sm text-foreground">ער"ן · עזרה ראשונה נפשית</span>
          <span className="font-mono text-xl text-destructive tracking-wider">1201</span>
        </a>
        <a
          href="tel:105"
          className="flex items-baseline justify-between rounded-lg border border-destructive/40 bg-destructive/5 px-5 py-4 hover:bg-destructive/10 transition-colors"
        >
          <span className="text-sm text-foreground">מוקד 105 · ילדים ונוער</span>
          <span className="font-mono text-xl text-destructive tracking-wider">105</span>
        </a>
      </div>
      <p className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
        אם יש סכנת חיים מיידית, חייגו 101.
      </p>
    </div>
  </div>
);

const BreathingCircle = () => (
  <div className="flex flex-col items-center gap-10">
    <div className="relative flex items-center justify-center w-56 h-56">
      <div className="absolute inset-0 rounded-full border border-primary/20" />
      <div className="absolute w-48 h-48 rounded-full bg-primary/15 animate-breathe" />
      <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-breathe" style={{ animationDelay: "-0.5s" }} />
      <div className="relative flex flex-col items-center gap-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">נשימה</span>
        <span className="font-display text-xl text-foreground/80">4 · 7 · 8</span>
      </div>
    </div>
    <div className="flex items-center gap-6 text-[11px] font-mono text-muted-foreground" dir="rtl">
      <span><span className="text-foreground/70">4</span> שאיפה</span>
      <span className="opacity-30">·</span>
      <span><span className="text-foreground/70">7</span> החזקה</span>
      <span className="opacity-30">·</span>
      <span><span className="text-foreground/70">8</span> נשיפה</span>
    </div>
  </div>
);

const AmbientToggle = ({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="fixed bottom-6 left-6 flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card/80 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-500 backdrop-blur-sm shadow-sm"
    title={isPlaying ? "השתק רקע" : "הפעל רקע"}
  >
    {isPlaying ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5" />}
    <span className="hidden sm:inline tracking-wider">{isPlaying ? "צליל רקע" : "שקט"}</span>
  </button>
);

const Index = () => {
  const [state, setState] = useState<AppState>("entry");
  const [userInput, setUserInput] = useState("");
  const [showBegin, setShowBegin] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [checks, setChecks] = useState<boolean[]>([]);
  const ambient = useAmbientSound();

  const checkCrisis = useCallback((text: string) => {
    const lower = text.toLowerCase();
    return crisisWords.some((w) => lower.includes(w.toLowerCase()));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    if (checkCrisis(userInput)) {
      setState("crisis");
      return;
    }
    setState("deconstruction");
  };

  useEffect(() => {
    if (state === "deconstruction") {
      setShowBegin(false);
      const t = setTimeout(() => setShowBegin(true), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (state === "grounding") {
      setChecks(Array(GROUNDING_STEPS[0].count).fill(false));
      setGroundingStep(0);
    }
  }, [state]);

  const handleCheck = (idx: number) => {
    const next = [...checks];
    next[idx] = true;
    setChecks(next);
  };

  const allChecked = checks.length > 0 && checks.every(Boolean);

  const advanceGrounding = () => {
    const nextStep = groundingStep + 1;
    if (nextStep >= GROUNDING_STEPS.length) {
      setState("resolution");
    } else {
      setGroundingStep(nextStep);
      setChecks(Array(GROUNDING_STEPS[nextStep].count).fill(false));
    }
  };

  const restart = () => {
    ambient.stop();
    setState("entry");
    setUserInput("");
    setShowBegin(false);
    setGroundingStep(0);
    setChecks([]);
  };

  if (state === "crisis") return <SafetyScreen />;

  const showAmbient = state === "grounding" || state === "resolution";
  const currentStep = GROUNDING_STEPS[groundingStep];
  const completedCount = checks.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-radial-soft" dir="rtl">
      {/* Header — persistent brand mark */}
      <header className="absolute top-6 right-6 left-6 flex items-center justify-between animate-slow-fade-in">
        <h1 className="text-[11px] font-mono tracking-[0.4em] uppercase text-muted-foreground">
          GroundState
        </h1>
        {state !== "entry" && (
          <button
            onClick={restart}
            className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
            title="התחל מחדש"
          >
            <span>איפוס</span>
            <ArrowLeft className="h-3 w-3" />
          </button>
        )}
      </header>

      <div className="w-full max-w-md space-y-10">

        {/* State 0: Entry */}
        {state === "entry" && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-slow-fade-in">
            <div className="text-center space-y-3">
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-muted-foreground">
                פרוטוקול איפוס מערכת
              </p>
              <h2 className="font-display text-4xl text-foreground leading-[1.15]">
                מה לוחץ עכשיו?
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
                משפט אחד. בלי לערוך. בלי לסדר.
              </p>
            </div>
            <Input
              dir="auto"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="מקור העומס העיקרי…"
              className="bg-card/60 border-border text-foreground placeholder:text-muted-foreground/40 h-14 text-base text-right rounded-xl px-5"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full h-12 font-mono text-xs tracking-[0.25em] uppercase bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-500 disabled:opacity-30 rounded-xl"
            >
              שחרר
            </Button>
          </form>
        )}

        {/* State 1: Deconstruction */}
        {state === "deconstruction" && (
          <div className="space-y-10 text-center">
            <div className="animate-text-shrink" dir="auto">
              <p className="text-foreground/90 font-display text-2xl leading-snug break-words">
                ״{userInput}״
              </p>
            </div>
            <div className="space-y-3 animate-slow-fade-in" style={{ animationDelay: "1.2s", opacity: 0, animationFillMode: "forwards" }}>
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-muted-foreground">
                התקבל
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                הלולאה הקוגניטיבית הושהתה.
              </p>
              <p className="text-sm text-primary/90 leading-relaxed">
                מאתחל הארקה סומטית…
              </p>
            </div>
            {showBegin && (
              <div className="flex justify-center animate-slow-fade-in">
                <Button
                  onClick={() => setState("grounding")}
                  className="h-12 px-12 font-mono text-xs tracking-[0.3em] uppercase bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-500 animate-pulse-glow rounded-xl"
                >
                  התחל
                </Button>
              </div>
            )}
          </div>
        )}

        {/* State 2: Grounding Protocol */}
        {state === "grounding" && (
          <div key={groundingStep} className="space-y-10 animate-slow-fade-in">
            {/* Progress meta */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
                <span>שלב {groundingStep + 1} / {GROUNDING_STEPS.length}</span>
                <span className="text-primary/80">{currentStep.sense}</span>
              </div>
              <Progress
                value={((groundingStep + completedCount / currentStep.count) / GROUNDING_STEPS.length) * 100}
                className="h-[2px] bg-muted"
              />
            </div>

            {/* Prompt — layered typography */}
            <div className="text-center space-y-3">
              <p className="font-display text-5xl text-primary leading-none">
                {currentStep.count}
              </p>
              <p className="text-lg text-foreground font-medium leading-snug">
                דברים שאתה <span className="text-primary">{currentStep.verb}</span> כרגע
              </p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                {currentStep.hint}
              </p>
            </div>

            {/* Check tokens */}
            <div className="flex justify-center gap-3">
              {checks.map((checked, i) => (
                <button
                  key={`${groundingStep}-${i}`}
                  onClick={() => !checked && handleCheck(i)}
                  disabled={checked}
                  aria-label={`סמן פריט ${i + 1}`}
                  className="group"
                >
                  <Checkbox
                    checked={checked}
                    className="h-10 w-10 rounded-lg border-2 border-border group-hover:border-primary/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 pointer-events-none"
                  />
                </button>
              ))}
            </div>

            {allChecked && (
              <div className="flex justify-center animate-slow-fade-in">
                <Button
                  onClick={advanceGrounding}
                  className="h-12 px-12 font-mono text-xs tracking-[0.3em] uppercase bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-500 rounded-xl"
                >
                  {groundingStep < GROUNDING_STEPS.length - 1 ? "המשך" : "סיום"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* State 3: Resolution */}
        {state === "resolution" && (
          <div className="space-y-12 animate-slow-fade-in">
            <BreathingCircle />
            <div className="text-center space-y-3">
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-muted-foreground">
                מצב יציב
              </p>
              <p className="font-display text-2xl text-foreground leading-snug">
                המערכת חזרה לקרקע.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                אפשר לחזור לעולם הפיזי.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={restart}
                variant="outline"
                className="h-11 px-8 font-mono text-[11px] tracking-[0.3em] uppercase border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-500 rounded-xl"
              >
                הפעל מחדש
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ambient sound toggle */}
      {showAmbient && (
        <AmbientToggle isPlaying={ambient.isPlaying} onToggle={ambient.toggle} />
      )}
    </div>
  );
};

export default Index;
