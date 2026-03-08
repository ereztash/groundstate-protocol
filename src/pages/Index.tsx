import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
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
  { count: 5, sense: "see", prompt: "Acknowledge 5 things you can see right now." },
  { count: 4, sense: "feel", prompt: "Acknowledge 4 things you can physically feel." },
  { count: 3, sense: "hear", prompt: "Acknowledge 3 things you can hear." },
  { count: 2, sense: "smell", prompt: "Acknowledge 2 things you can smell." },
  { count: 1, sense: "taste", prompt: "Acknowledge 1 thing you can taste." },
];

const SafetyScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
    <div className="max-w-lg text-center space-y-8 animate-slow-fade-in" dir="rtl">
      <div className="w-16 h-16 mx-auto rounded-full border-2 border-destructive flex items-center justify-center">
        <span className="text-2xl">⚠</span>
      </div>
      <p className="text-lg leading-relaxed text-foreground font-medium">
        זיהינו מצוקה גבוהה. אני כלי עזר ראשוני בלבד, לא תחליף לטיפול נפשי או רפואי.
        אם אתה בסכנה מיידית, יש לפנות לעזרה מקצועית עכשיו:
      </p>
      <div className="space-y-4">
        <a
          href="tel:1201"
          className="block w-full rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xl font-mono text-destructive hover:bg-destructive/20 transition-colors"
        >
          קו חירום ער"ן — 1201
        </a>
        <a
          href="tel:105"
          className="block w-full rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xl font-mono text-destructive hover:bg-destructive/20 transition-colors"
        >
          מוקד הגנה על ילדים ונוער — 105
        </a>
      </div>
    </div>
  </div>
);

const BreathingCircle = () => (
  <div className="flex flex-col items-center gap-8">
    <div className="relative flex items-center justify-center w-48 h-48">
      <div className="absolute w-48 h-48 rounded-full bg-primary/20 animate-breathe" />
      <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-breathe" style={{ animationDelay: "-0.5s" }} />
      <span className="relative text-sm font-mono text-muted-foreground tracking-widest uppercase">
        breathe
      </span>
    </div>
    <p className="text-xs text-muted-foreground font-mono tracking-wider">
      4s inhale · 7s hold · 8s exhale
    </p>
  </div>
);

const AmbientToggle = ({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="fixed bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-500 backdrop-blur-sm"
    title={isPlaying ? "Mute ambient" : "Play ambient"}
  >
    {isPlaying ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5" />}
    <span className="hidden sm:inline">{isPlaying ? "ambient on" : "ambient off"}</span>
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center animate-slow-fade-in">
          <h1 className="text-sm font-mono tracking-[0.3em] uppercase text-muted-foreground mb-1">
            GroundState
          </h1>
          {state === "entry" && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              system cool-down protocol
            </p>
          )}
        </div>

        {/* State 0: Entry */}
        {state === "entry" && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slow-fade-in">
            <Input
              dir="auto"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="What is the system currently processing?"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 h-12 font-mono text-sm"
            />
            <Button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full h-11 font-mono text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-500 disabled:opacity-30"
            >
              Initiate Dump
            </Button>
          </form>
        )}

        {/* State 1: Deconstruction */}
        {state === "deconstruction" && (
          <div className="space-y-8">
            <div className="animate-text-shrink" dir="auto">
              <p className="text-foreground font-mono text-sm leading-relaxed text-center break-words">
                "{userInput}"
              </p>
            </div>
            <div className="text-center animate-slow-fade-in" style={{ animationDelay: "1s", opacity: 0, animationFillMode: "forwards" }}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acknowledged. Cognitive loop suspended.
                <br />
                <span className="text-primary/80">Initiating somatic grounding...</span>
              </p>
            </div>
            {showBegin && (
              <div className="flex justify-center animate-slow-fade-in">
                <Button
                  onClick={() => setState("grounding")}
                  className="h-11 px-10 font-mono text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-500 animate-pulse-glow"
                >
                  Begin
                </Button>
              </div>
            )}
          </div>
        )}

        {/* State 2: Grounding Protocol */}
        {state === "grounding" && (
          <div className="space-y-8 animate-slow-fade-in">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Step {groundingStep + 1} / {GROUNDING_STEPS.length}</span>
                <span>{GROUNDING_STEPS[groundingStep].sense}</span>
              </div>
              <Progress
                value={((groundingStep) / GROUNDING_STEPS.length) * 100}
                className="h-1 bg-muted"
              />
            </div>

            <p className="text-sm text-foreground font-medium text-center leading-relaxed">
              {GROUNDING_STEPS[groundingStep].prompt}
            </p>

            <div className="flex justify-center gap-3">
              {checks.map((checked, i) => (
                <button
                  key={`${groundingStep}-${i}`}
                  onClick={() => !checked && handleCheck(i)}
                  disabled={checked}
                  className="group"
                >
                  <Checkbox
                    checked={checked}
                    className="h-8 w-8 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 pointer-events-none"
                  />
                </button>
              ))}
            </div>

            {allChecked && (
              <div className="flex justify-center animate-slow-fade-in">
                <Button
                  onClick={advanceGrounding}
                  className="h-11 px-10 font-mono text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-500"
                >
                  {groundingStep < GROUNDING_STEPS.length - 1 ? "Continue" : "Complete"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* State 3: Resolution */}
        {state === "resolution" && (
          <div className="space-y-12 animate-slow-fade-in">
            <BreathingCircle />
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground leading-relaxed">
                System state stabilized. Identity preserved.
              </p>
              <p className="text-xs text-muted-foreground">
                You may return to the physical world.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={restart}
                variant="outline"
                className="h-11 px-8 font-mono text-xs tracking-wider uppercase border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-500"
              >
                Restart Protocol
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ambient sound toggle - visible during grounding & resolution */}
      {showAmbient && (
        <AmbientToggle isPlaying={ambient.isPlaying} onToggle={ambient.toggle} />
      )}
    </div>
  );
};

export default Index;
