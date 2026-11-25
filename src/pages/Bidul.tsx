import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionHead from "@/components/landing/SectionHead";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { usePublicUrl } from "@/hooks/usePublicUrl";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { worksheetVoices, type ClientExcerpt } from "@/lib/clients";
import {
  sheetText,
  whatsappSheetUrl,
  whatsappUrl,
  type SheetLine,
} from "@/lib/contact";
import { splitByGeneralWords, uniqueGeneralWords } from "@/lib/generalWords";
import "./bidul.css";

/**
 * /bidul, the five-question worksheet (2026-11-25).
 *
 * The five questions are the five moves Erez makes when he looks for a
 * client's differentiation, each one checked against session transcripts on
 * 2026-11-25. All five work on the client's own material. The same check
 * showed what does not work: Erez offering the wording himself. So the page
 * never writes a word for the reader. It asks, it quotes one of their own
 * general words back at them, and it hands back only what they wrote.
 *
 * The reader leaves with something that stands without a call: a sheet in
 * their own words, with a first sentence on it, that they can copy or print.
 * What the sheet cannot do is hear what was shortened or said in passing, and
 * the page says so. That is the part a conversation completes, and it is the
 * page's one step: send the sheet in WhatsApp.
 *
 * No word on payment anywhere on the page, footer included, the same rule the
 * door pages keep. No model and no backend: the general-word check is a fixed
 * list (src/lib/generalWords.ts) and the page tells the reader that.
 *
 * What is written stays in this browser (localStorage) until the reader chooses
 * to send it. Analytics events carry step numbers only, never text, and the
 * sheet is masked from session recording.
 */

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

const COUNT = 5;
/** The step after the last question: completing the sentence. */
const SENTENCE = COUNT;
const LIMIT = 600;
const KEY = "cor.bidul.v1";
const LEAD = "בוחרים בי כי";

type State = {
  /** 0 to 4 is a question, 5 is the sentence. */
  step: number;
  answers: string[];
  /** The general word the second question asks about. */
  word: string;
  sentence: string;
  /** ISO time the sheet was taken out, empty until then. */
  doneAt: string;
};

const EMPTY: State = {
  step: 0,
  answers: ["", "", "", "", ""],
  word: "",
  sentence: "",
  doneAt: "",
};

type Action =
  | { type: "restore"; state: State }
  | { type: "write"; index: number; text: string }
  | { type: "sentence"; text: string }
  | { type: "word"; word: string }
  | { type: "next" }
  | { type: "edit"; index: number }
  | { type: "finish"; at: string }
  | { type: "reopen" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "restore":
      return action.state;
    case "write":
      return {
        ...state,
        answers: state.answers.map((a, i) => (i === action.index ? action.text : a)),
      };
    case "sentence":
      return { ...state, sentence: action.text };
    case "word":
      return { ...state, word: action.word };
    case "next": {
      let word = state.word;
      // The word is chosen when the first answer is left, and kept once the
      // second question has an answer that speaks about it.
      if (state.step === 0 && state.answers[1].trim() === "") {
        const found = uniqueGeneralWords(state.answers[0]);
        word = found.includes(word) ? word : (found[0] ?? "");
      }
      let step = SENTENCE;
      for (let i = state.step + 1; i < COUNT; i++) {
        if (state.answers[i].trim() === "") {
          step = i;
          break;
        }
      }
      return { ...state, word, step };
    }
    case "edit":
      return { ...state, step: action.index, doneAt: "" };
    case "finish":
      return { ...state, doneAt: action.at };
    case "reopen":
      return { ...state, step: SENTENCE, doneAt: "" };
    case "reset":
      return EMPTY;
  }
}

/** What was saved in this browser, or null. Anything malformed is dropped. */
function readSaved(): State | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<State>;
    if (!Array.isArray(v.answers) || v.answers.length !== COUNT) return null;
    const text = (t: unknown, max = LIMIT) => (typeof t === "string" ? t.slice(0, max) : "");
    const step =
      typeof v.step === "number" && v.step >= 0 && v.step <= SENTENCE
        ? Math.floor(v.step)
        : 0;
    return {
      step,
      answers: v.answers.map((a) => text(a)),
      word: text(v.word, 40),
      sentence: text(v.sentence),
      doneAt: text(v.doneAt, 40),
    };
  } catch {
    return null;
  }
}

type Question = { ask: string; why: string };

/** The five questions. The second one is built from the reader's own word. */
function questionsFor(word: string): Question[] {
  return [
    {
      ask: "מה אתם אומרים היום כששואלים אתכם מה אתם עושים?",
      why: "אפשר להדביק מהפרופיל או מהאתר. גם בפגישה אני מתחיל ממה שכבר כתבתם לעצמכם.",
    },
    word
      ? {
          ask: `כתבתם "${word}". זו מילה גדולה וכללית. מה זה "${word}" אצלכם, בדוגמה אחת?`,
          why: "מספיקה דוגמה אחת, של לקוח אחד ומה שעשיתם בשבילו.",
        }
      : {
          ask: "איזו מילה ממה שכתבתם גם מישהו אחר מהתחום היה כותב על עצמו? ומה היא אומרת אצלכם, בדוגמה אחת?",
          why: "הרשימה שלי לא מצאה מילה כזאת, אז הבחירה אצלכם.",
        },
    {
      ask: "חשבו על לקוח אחד שהיה מרוצה. אם הייתי שואל אותו איך הוא מתאר אתכם, מה הוא היה אומר?",
      why: "במילים שלו, כמו שהוא מדבר.",
    },
    {
      ask: "מישהו אחר מהתחום מתמודד מולכם על אותו פרויקט. למה שיבחרו בכם ולא בו?",
      why: "אם התשובה הראשונה היא משהו שגם הוא היה אומר על עצמו, כתבו את זו שבאה אחריה.",
    },
    {
      ask: "היזכרו בפעם אחת שבה ראיתם משהו שהלקוח לא ראה. מה ראיתם, ואיך ידעתם?",
      why: "מה שנראה לכם מובן מאליו, אני חושב ששם מסתתר הבידול.",
    },
  ];
}

/** The short name of each row, on the sheet and in the message that carries it. */
function labelFor(index: number, word: string): string {
  if (index === 1 && word) return `המילה "${word}"`;
  return [
    "מה שכתוב היום",
    "המילה הכללית",
    "מה לקוח היה אומר",
    "מישהו אחר על אותו פרויקט",
    "מקרה אחד",
  ][index];
}

/** The words on the draft in the hero. Each one is in the fixed list. */
const DRAFT_WORDS = ["מקצועי", "יחס אישי", "איכותי", "ניסיון רב"];

/** The reader's sentence without a repeated lead or a closing mark. */
function tailOf(sentence: string): string {
  return sentence
    .trim()
    .replace(new RegExp(`^${LEAD}\\s*`), "")
    .replace(/[.!?…\s]+$/, "");
}

function dateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Grows the field to its text, so the paper has no scrollbar. */
function fit(el: HTMLTextAreaElement | null) {
  if (!el || el.scrollHeight === 0) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

/**
 * Five strokes, read from the right like the page. Each one stands off true
 * until its question is answered, then turns into line and stops: the brand's
 * one motion, and the sheet's progress mark. Ink only. The copper point is
 * kept for the headline, and for the reader's sentence once it exists.
 */
const STROKES = [
  { cx: 76, a: -62 },
  { cx: 60, a: 34 },
  { cx: 44, a: -16 },
  { cx: 28, a: 48 },
  { cx: 12, a: -30 },
] as const;

const Strokes = ({ settled, className }: { settled: boolean[]; className?: string }) => (
  <svg
    viewBox="0 0 88 24"
    className={`bd-strokes ${className ?? ""}`}
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
      {STROKES.map((s, i) => (
        <line
          key={s.cx}
          x1={s.cx - 5}
          y1={12}
          x2={s.cx + 5}
          y2={12}
          style={{
            transform: `rotate(${settled[i] ? 0 : s.a}deg)`,
            transformOrigin: `${s.cx}px 12px`,
          }}
        />
      ))}
    </g>
  </svg>
);

/** The reader's text, with the general words from the fixed list marked. */
const Marked = ({ text }: { text: string }) => (
  <>
    {splitByGeneralWords(text).map((part, i) =>
      part.general ? (
        <mark key={i} className="bd-general">
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      )
    )}
  </>
);

/** A client's own words about the work, linked to the profile they were posted on. */
const Voice = ({ voice, className }: { voice: ClientExcerpt; className?: string }) => (
  <figure className={className}>
    <blockquote className="text-lg font-medium leading-snug text-foreground">
      ״{voice.text}״
    </blockquote>
    <figcaption className="mt-3 text-sm leading-snug text-muted-foreground">
      <a
        href={voice.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
      >
        {voice.attribution}
        <span className="sr-only"> (נפתח בלינקדאין)</span>
      </a>
      {voice.credential && <span>, {voice.credential}</span>}
    </figcaption>
  </figure>
);

const Bidul = () => {
  useDocumentMeta({
    title: "למה שיבחרו דווקא בכם? חמש שאלות | COR-SYS",
    description:
      "חמש השאלות שאני שואל עצמאים כשאנחנו מחפשים את הבידול שלהם. כעשר דקות, ובסוף יש לכם דף אחד, במילים שלכם, שכתוב בו למה בוחרים דווקא בכם.",
    path: "/bidul",
    ogTitle: "למה שיבחרו דווקא בכם?",
    ogDescription: "חמש שאלות, כעשר דקות, ודף אחד במילים שלכם.",
  });

  const pub = usePublicUrl();
  const [state, dispatch] = useReducer(reducer, EMPTY);
  const [ready, setReady] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const [askClear, setAskClear] = useState(false);

  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  // What was written here before comes back after the first paint, so the
  // prerendered page and the first client render are the same empty sheet.
  useEffect(() => {
    const saved = readSaved();
    if (saved) dispatch({ type: "restore", state: saved });
    setReady(true);
    // Scopes the print rules to this page while it is mounted.
    document.documentElement.classList.add("bd-doc");
    return () => document.documentElement.classList.remove("bd-doc");
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Private mode or a full store: the sheet still works for this visit.
    }
  }, [ready, state]);

  const done = state.doneAt !== "";

  // Focus follows the reader: to the next field, or to the finished sheet.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (done) resultRef.current?.focus();
    else fieldRef.current?.focus();
  }, [state.step, done]);

  useEffect(() => {
    fit(fieldRef.current);
  }, [state.step, done, ready]);

  const found = useMemo(() => uniqueGeneralWords(state.answers[0]), [state.answers]);
  const questions = questionsFor(state.word);
  const onSentence = state.step === SENTENCE;
  const current = onSentence ? state.sentence : state.answers[state.step];
  const started = state.answers.some((a) => a.trim() !== "") || state.sentence.trim() !== "";
  const settled = state.answers.map(
    (a, i) => a.trim() !== "" && (done || state.step !== i)
  );

  // The same move the second question makes, live: a general word in what is
  // being written is quoted back. It never blocks. The first answer is left
  // alone, since it is meant to be what already exists.
  const caught =
    state.step === 0
      ? []
      : uniqueGeneralWords(current).filter(
          (w) => !(state.step === 1 && w === state.word)
        );
  const note = nudge
    ? "כתבו כמה מילים, ואז נמשיך."
    : caught.length > 0
      ? `כתבתם "${caught[0]}". גם מישהו אחר מהתחום היה כותב את זה. מה זה אומר אצלכם, בדוגמה אחת?`
      : "";

  const tail = tailOf(state.sentence);
  const fullSentence = tail ? `${LEAD} ${tail}` : "";
  const lines: SheetLine[] = state.answers.map((text, i) => ({
    label: labelFor(i, state.word),
    text,
  }));
  const waHref = whatsappSheetUrl(fullSentence, lines);
  const anyMarked =
    uniqueGeneralWords([tail, ...state.answers].join("\n")).length > 0;

  const onNext = () => {
    if (!onSentence && current.trim() === "") {
      setNudge(true);
      fieldRef.current?.focus();
      return;
    }
    setNudge(false);
    moveFocus.current = true;
    if (onSentence) {
      trackEvent("bidul_complete", { with_sentence: tail !== "" });
      dispatch({ type: "finish", at: new Date().toISOString() });
    } else {
      trackEvent("bidul_step", { step: state.step + 1 });
      dispatch({ type: "next" });
    }
  };

  const onType = (text: string) => {
    if (nudge) setNudge(false);
    if (onSentence) dispatch({ type: "sentence", text });
    else dispatch({ type: "write", index: state.step, text });
    fit(fieldRef.current);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onNext();
    }
  };

  const onEdit = (index: number) => {
    setNudge(false);
    moveFocus.current = true;
    dispatch({ type: "edit", index });
  };

  const onReopen = () => {
    setCopied("");
    moveFocus.current = true;
    dispatch({ type: "reopen" });
  };

  const onStart = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick("bidul_start");
    // Focus inside the tap, so a phone raises its keyboard; then bring the
    // sheet under the fixed header.
    if (done) resultRef.current?.focus({ preventScroll: true });
    else fieldRef.current?.focus({ preventScroll: true });
    sheetRef.current?.scrollIntoView?.({ block: "start" });
  };

  const onCopy = async () => {
    trackEvent("bidul_copy");
    try {
      await navigator.clipboard.writeText(sheetText(fullSentence, lines));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  const onPrint = () => {
    trackEvent("bidul_print");
    window.print();
  };

  const onClear = () => {
    setAskClear(false);
    setNudge(false);
    setCopied("");
    dispatch({ type: "reset" });
    moveFocus.current = true;
    // The step may not change (already on the first question), so the focus
    // effect would not run; move it here as well.
    fieldRef.current?.focus();
  };

  const startLabel = done
    ? "לדף שלכם"
    : started
      ? "להמשיך מאיפה שעצרתם"
      : "להתחיל בשאלה הראשונה";

  const progress = done
    ? ""
    : onSentence
      ? "נשאר המשפט"
      : `שאלה ${state.step + 1} מתוך ${COUNT}`;

  /** The open row: the question, the ruled field, the live note, the step on. */
  const field = (opts: {
    id: string;
    ask: string;
    why: string;
    lines: 2 | 4;
    button: string;
    withChips?: boolean;
    lead?: string;
  }) => (
    <div className="ld-in">
      <h3 id={`${opts.id}-q`} className="bd-q mt-1.5">
        {opts.ask}
      </h3>
      <p id={`${opts.id}-why`} className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {opts.why}
      </p>

      {opts.withChips && found.length > 1 && (
        <fieldset className="mt-4">
          <legend className="text-sm leading-relaxed text-muted-foreground">
            הרשימה שלי מצאה כמה מילים כאלה במה שכתבתם. על איזו מהן לשאול?
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {found.map((w) => (
              <label key={w} className="bd-chip" data-on={w === state.word ? "" : undefined}>
                <input
                  type="radio"
                  name="bidul-word"
                  value={w}
                  checked={w === state.word}
                  onChange={() => dispatch({ type: "word", word: w })}
                />
                {w}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {opts.lead && (
        <p className="bd-lead mt-5" aria-hidden="true">
          {opts.lead}
        </p>
      )}

      <textarea
        ref={fieldRef}
        id={opts.id}
        className="bd-field"
        data-lines={opts.lines}
        rows={opts.lines}
        maxLength={LIMIT}
        value={current}
        onChange={(e) => onType(e.target.value)}
        onKeyDown={onKeyDown}
        aria-labelledby={`${opts.id}-q`}
        aria-describedby={`${opts.id}-why ${opts.id}-note`}
      />

      <p
        id={`${opts.id}-note`}
        role="status"
        aria-live="polite"
        className="bd-note mt-3 text-sm font-semibold leading-relaxed text-accent"
      >
        {note}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" className="ld-cta w-full sm:w-auto" onClick={onNext}>
          {opts.button}
        </button>
        {LIMIT - current.length <= 80 && (
          <p className="text-sm text-muted-foreground">
            נשארו {LIMIT - current.length} תווים.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bd-page ld-paper min-h-screen overflow-x-clip text-foreground">
      <a href="#bidul-main" className="skip-to-content">
        דילוג לתוכן
      </a>

      <SiteHeader />

      <main id="bidul-main" dir="rtl">
        {/* First screen: who is asking, what it is, for whom and how long,
            and the one step. Light, with his face in it on a phone too. */}
        <section
          aria-labelledby="bidul-title"
          className="bd-noprint relative pt-24 pb-14 md:pt-32 md:pb-20"
        >
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={pub(portrait)}
                  alt="תמונת פורטרט: גבר במעיל כהה וחולצה לבנה, מבט ישיר למצלמה, רקע ירוק זית."
                  width={48}
                  height={48}
                  loading="eager"
                  decoding="async"
                  className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
                />
                <p className="text-sm leading-snug">
                  <span className="block font-bold text-foreground">ארז טל-שיר</span>
                  <span className="text-muted-foreground">
                    עובד סוציאלי טכנולוגי, יועץ עסקי לעצמאים
                  </span>
                </p>
              </div>

              <p className="cor-overline-he mt-7 !text-base">לעצמאים, כעשר דקות</p>

              <h1 id="bidul-title" className="cor-display mt-5 text-foreground">
                אני שואל חמש שאלות, ואתם כותבים למה בוחרים דווקא בכם
                <span className="cor-point">.</span>
              </h1>

              <p className="cor-body-lg mt-6 max-w-xl font-medium text-foreground">
                אלה השאלות שאני שואל עצמאים כשאנחנו מחפשים את הבידול שלהם. זה
                לוקח כעשר דקות, ואני לא כותב בדף אף מילה, כך שכל מה שיהיה בו
                יצא מכם.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <a
                  href="#sheet"
                  onClick={onStart}
                  aria-describedby="bidul-cta-note"
                  className="ld-cta w-full shrink-0 sm:w-auto sm:whitespace-nowrap"
                >
                  {startLabel}
                </a>
                <p id="bidul-cta-note" className="text-sm leading-relaxed text-muted-foreground">
                  הכתיבה נשארת בדפדפן שלכם. אין כאן בינה מלאכותית, ואין הרשמה.
                </p>
              </div>
            </div>

            {/* The two sheets tell the page in one look: a draft of the words
                everyone writes, and over it a client's own words about hers. */}
            <div className="md:mt-10">
              <div
                className="ld-draft bd-draft"
                style={{ "--tilt": "-1.6deg" } as CSSProperties}
              >
                <p className="bd-draft-words">
                  {DRAFT_WORDS.map((w) => (
                    <span key={w} className="bd-general">
                      {w}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  את המילים האלה כותב על עצמו גם מי שמתחרה בכם.
                </p>
              </div>
              <Voice
                voice={worksheetVoices.ownWords}
                className="ld-sheet bd-over p-6 sm:p-7"
              />
            </div>
          </div>
        </section>

        {/* The sheet, on the desk. Masked from session recording: what is
            typed here is the reader's, and stays theirs. */}
        <section
          id="sheet"
          ref={sheetRef}
          aria-labelledby="sheet-title"
          data-clarity-mask="true"
          className="bd-anchor bd-desk ld-desk ld-section"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            {!done && (
              <>
                <div className="ld-sheet ld-stack bd-print">
                  <div className="bd-sheet-head">
                    <div className="bd-sheet-title">
                      <h2
                        id="sheet-title"
                        className="font-heading text-2xl font-black text-foreground"
                      >
                        חמש השאלות
                      </h2>
                      <p className="bd-noprint text-sm font-semibold text-muted-foreground">
                        {progress}
                      </p>
                    </div>
                    <Strokes settled={settled} className="text-foreground" />
                  </div>

                  <ol className="bd-rows">
                    {questions.map((q, i) => {
                      const open = i === state.step;
                      const kept = !open && state.answers[i].trim() !== "";
                      const label = labelFor(i, i < state.step || kept ? state.word : "");
                      return (
                        <li
                          key={i}
                          className="bd-row"
                          data-state={open ? "open" : kept ? "kept" : "ahead"}
                        >
                          <span className="bd-row__n" aria-hidden="true">
                            {i + 1}
                          </span>
                          <div className="bd-row__body" data-kept={kept ? "" : undefined}>
                            <p
                              className={`text-xs font-bold ${
                                open || kept ? "text-primary" : "text-muted-foreground"
                              }`}
                            >
                              {label}
                            </p>
                            {open &&
                              field({
                                id: `bidul-q${i + 1}`,
                                ask: q.ask,
                                why: q.why,
                                lines: 4,
                                button: "להמשיך",
                                withChips: i === 1,
                              })}
                            {kept && (
                              <>
                                <p className="bd-answer">{state.answers[i]}</p>
                                <button
                                  type="button"
                                  className="bd-textbtn bd-noprint"
                                  onClick={() => onEdit(i)}
                                >
                                  לערוך
                                  <span className="sr-only">, {label}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  <div className="bd-row bd-sum" data-state={onSentence ? "open" : "ahead"}>
                    <span className="bd-row__n" aria-hidden="true" />
                    <div className="bd-row__body">
                      <p
                        className={`text-xs font-bold ${
                          onSentence ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        המשפט
                      </p>
                      {onSentence ? (
                        field({
                          id: "bidul-sentence",
                          ask: "קראו את מה שכתבתם, והשלימו את המשפט במילים שכבר מופיעות למעלה.",
                          why: "אפשר גם להשאיר ריק ולהשלים אחר כך.",
                          lines: 2,
                          button: "להוציא את הדף",
                          lead: LEAD,
                        })
                      ) : (
                        <p className="bd-lead mt-1" data-ahead="">
                          {LEAD} <span className="bd-blank" aria-hidden="true" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bd-noprint mt-7 text-sm leading-relaxed text-foreground">
                  <p>
                    מה שאתם כותבים נשמר רק בדפדפן הזה, כדי שתוכלו לחזור אליו.
                    הוא לא נשלח לשום מקום עד שתבחרו לשלוח.
                  </p>
                  {started && !askClear && (
                    <button
                      type="button"
                      className="bd-textbtn mt-1"
                      onClick={() => setAskClear(true)}
                    >
                      למחוק הכול ולהתחיל מחדש
                    </button>
                  )}
                  {askClear && (
                    <p className="mt-1 flex flex-wrap items-center gap-x-5">
                      <span className="font-semibold">למחוק את כל מה שכתבתם?</span>
                      <button type="button" className="bd-textbtn" onClick={onClear}>
                        כן, למחוק
                      </button>
                      <button
                        type="button"
                        className="bd-textbtn"
                        onClick={() => setAskClear(false)}
                      >
                        להשאיר
                      </button>
                    </p>
                  )}
                </div>
              </>
            )}

            {done && (
              <>
                {/* The finished sheet: a dated document in the reader's words. */}
                <article className="ld-sheet ld-stack bd-print ld-in" aria-labelledby="sheet-title">
                  <div className="bd-sheet-head">
                    <p className="text-sm font-bold text-primary">
                      דף עבודה, {dateLabel(state.doneAt)}
                    </p>
                    <Strokes settled={settled} className="text-foreground" />
                  </div>

                  <div className="bd-result-head">
                    <h2
                      id="sheet-title"
                      ref={resultRef}
                      tabIndex={-1}
                      className="cor-title bd-result-title text-foreground"
                    >
                      {LEAD}{" "}
                      {tail ? (
                        <Marked text={tail} />
                      ) : (
                        <>
                          <span className="bd-blank" aria-hidden="true" />
                          <span className="sr-only">(עוד לא הושלם)</span>
                        </>
                      )}
                      <span className="cor-point">.</span>
                    </h2>
                  </div>

                  <ol className="bd-rows">
                    {lines.map((line, i) => (
                      <li key={i} className="bd-row" data-state="kept">
                        <span className="bd-row__n" aria-hidden="true">
                          {i + 1}
                        </span>
                        <div className="bd-row__body">
                          <p className="text-xs font-bold text-primary">{line.label}</p>
                          <p className="bd-answer mt-1">
                            <Marked text={line.text} />
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="bd-sheet-foot text-sm leading-relaxed text-muted-foreground">
                    <p>
                      {anyMarked
                        ? "הקו הגלי מסמן מילים מרשימה קבועה של מילים כלליות. הדף לא מבין את הטקסט, והוא יכול לפספס מילה או לסמן בטעות."
                        : "הדף לא מצא כאן מילה מהרשימה הקבועה של מילים כלליות. הוא לא מבין את הטקסט, כך שזה עוד לא אומר שהמשפט חד."}
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
                      חמש השאלות, ארז טל-שיר
                    </p>
                  </div>
                </article>

                <div className="bd-noprint mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCtaClick("whatsapp_bidul_sheet")}
                      className="ld-cta w-full shrink-0 sm:w-auto"
                    >
                      <WhatsAppIcon className="h-5 w-5 shrink-0" />
                      לשלוח לי את הדף בוואטסאפ
                      <span className="sr-only"> (נפתח בוואטסאפ)</span>
                    </a>
                    <p className="text-sm leading-relaxed text-foreground">
                      הדף נפתח אצלכם בוואטסאפ כהודעה מוכנה, ואתם שולחים.
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5">
                    <button type="button" className="bd-textbtn" onClick={onCopy}>
                      להעתיק את הדף
                    </button>
                    <button type="button" className="bd-textbtn" onClick={onPrint}>
                      להדפיס או לשמור כקובץ
                    </button>
                    <button type="button" className="bd-textbtn" onClick={onReopen}>
                      לערוך תשובות
                    </button>
                  </div>
                  <p role="status" aria-live="polite" className="bd-note text-sm font-semibold text-foreground">
                    {copied === "ok"
                      ? "הדף הועתק."
                      : copied === "fail"
                        ? "ההעתקה לא עבדה בדפדפן הזה. אפשר לסמן את הטקסט בדף ולהעתיק."
                        : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* What the sheet cannot do, said plainly, and the step that does it. */}
        <section aria-labelledby="between-title" className="bd-noprint ld-section">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 bd-cols-a md:gap-14">
            <div>
              <SectionHead label="מה הדף לא עושה" />
              <h2 id="between-title" className="cor-title mt-6 text-foreground">
                את מה שבין השורות הדף לא שומע.
              </h2>
              <p className="cor-body-lg mt-5 max-w-xl text-foreground">
                הדף מסמן מילים מרשימה קבועה, והוא לא שומע מה קיצרתם ומה אמרתם
                רק בדרך אגב. כשמישהו אומר לי "ככה נכון לעשות", אני חושב ששם
                מסתתר הבידול.
              </p>
              <p className="cor-body-lg mt-4 max-w-xl text-foreground">
                שלחו לי את הדף, ואחזיר לכם מה אני שומע בו, ומה חסר כדי שלקוח
                יגיד "זה בשבילי". אם נקבע שיחה, נתחיל ממנו.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                {done ? (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("whatsapp_bidul_between")}
                    className="ld-cta w-full shrink-0 sm:w-auto"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    לשלוח את הדף
                    <span className="sr-only"> (נפתח בוואטסאפ)</span>
                  </a>
                ) : (
                  <a
                    href="#sheet"
                    onClick={onStart}
                    className="ld-cta w-full shrink-0 sm:w-auto"
                  >
                    {started ? "לחזור לדף ולסיים" : "להתחיל בשאלה הראשונה"}
                  </a>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  אפשר גם{" "}
                  <a
                    href={whatsappUrl("he", "sentence")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("whatsapp_bidul_sentence")}
                    className="ld-link"
                  >
                    לכתוב לי רק את המשפט
                    <span className="sr-only"> (נפתח בוואטסאפ)</span>
                  </a>
                  , או{" "}
                  <Link to="/#book" className="ld-link">
                    לתאם שיחת התאמה
                  </Link>
                  .
                </p>
              </div>

              <p className="mt-8 max-w-xl border-t border-foreground/15 pt-5 text-sm leading-relaxed text-muted-foreground">
                בליווי של 30 יום אנחנו בונים יחד את המשפט, את המחיר ואת הפנייה
                הראשונה.
              </p>
            </div>

            <Voice voice={worksheetVoices.betweenLines} className="ld-sheet p-6 sm:p-7 md:mt-12" />
          </div>
        </section>

        {/* Where the questions come from: the two professions, in his words
            and in facts he has published, and why the sheet only asks. */}
        <section aria-labelledby="origin-title" className="bd-noprint ld-band-sheet ld-section">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 bd-cols-b md:gap-14">
            <div className="md:order-2">
              <SectionHead label="עבודה סוציאלית עסקית" />
              <h2 id="origin-title" className="cor-title mt-6 text-foreground">
                השאלות האלה באות משני מקצועות.
              </h2>
              <p className="cor-body-lg mt-5 max-w-xl text-foreground">
                למדתי עבודה סוציאלית בתל-חי, במסלול דחק וטראומה, ומ-2015 אני
                עובד עם נוער. היום אני יועץ עסקי לעצמאים, ואני מתעסק בבידול,
                במיצוב ובפסיכולוגיה נרטיבית.
              </p>
              <p className="cor-body-lg mt-4 max-w-xl text-foreground">
                בעבודה סוציאלית אני מקשיב לסיפור שאדם מספר על עצמו, ובייעוץ
                עסקי אני שואל מי יבחר בו ולמה. אני חושב שבידול נמצא בחיבור בין
                השניים.
              </p>
              <p className="cor-body-lg mt-4 max-w-xl text-foreground">
                עברתי על תמלולי הפגישות שלי, מהלך אחרי מהלך. כשעבדתי על מה
                שהלקוח אמר, הוא ניסח מחדש במילים שלו יותר מאשר כשהבאתי לו כלי
                או הסבר משלי. כשהצעתי ניסוח משלי, היו פעמים שהוא נדחה במקום.
                בגלל זה הדף רק שואל.
              </p>
              <Link to="/about" className="ld-link mt-6 inline-block">
                עוד על הדרך שלי
              </Link>
            </div>

            <div className="grid gap-6 md:order-1 md:mt-12">
              <img
                src={pub(portrait)}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                className="bd-portrait rounded-sm border border-border object-cover"
              />
              <Voice voice={worksheetVoices.alreadyThere} className="border-t border-foreground/15 pt-6" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang="he" callLine={false} />
    </div>
  );
};

export default Bidul;
