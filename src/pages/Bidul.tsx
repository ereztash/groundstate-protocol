import {
  useEffect,
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
import {
  routeExamples,
  sessionMoments,
  worksheetVoices,
  type ClientExcerpt,
  type SessionTurn,
} from "@/lib/clients";
import {
  sheetText,
  whatsappSelfUrl,
  whatsappSheetUrl,
  whatsappUrl,
  type SheetLine,
} from "@/lib/contact";
import { splitByGeneralWords, uniqueGeneralWords } from "@/lib/generalWords";
import "./bidul.css";

/**
 * /bidul, the five-question worksheet (2026-11-25, reordered 2026-11-26).
 *
 * The questions follow the order of states Erez moves a client through when
 * he looks for their differentiation, read off the sprint transcripts and
 * approved by him on 2026-11-26: what they say today, one client and one real
 * thing done for them, what they did there and what they saw, what another
 * professional would have left the client without, and only then one sentence
 * to a client who does not believe it. Asking for the sentence directly, or
 * offering a ready label, did not bring one in those transcripts. Offering the
 * wording himself did not work either. So the page never writes a word for
 * the reader. It asks, it quotes one of their own general words back at them,
 * and it hands back only what they wrote, with no lead of ours on the sentence.
 *
 * Two states a page cannot hold, it hands over: the clearest sentence came
 * after a break more often than not, so the sheet can be sent to oneself and
 * reopened; and a sentence needs a reader, so the sheet ends with one question
 * to put to someone who knows the work, and the WhatsApp step to Erez.
 *
 * The reader leaves with something that stands without a call: a sheet in
 * their own words, with a first sentence on it, that they can copy or print.
 * What the sheet cannot do is hear what was shortened or said in passing, and
 * the page says so. That is the part a conversation completes, and it is the
 * page's one step: send the sheet in WhatsApp.
 *
 * Before anything is written, the reader picks one of two ways (2026-11-26,
 * Erez: show what they gain before they invest): one question, the comparison
 * asked about a single client, or all five. Each way shows what it asks, what
 * comes out of it, and a real answer from a session, word for word with no
 * name. The one question is the fourth of the five, so its answer waits there
 * if the reader goes on to the rest.
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

/** The questions that build up to the sentence. */
const COUNT = 4;
/** The step after them: the sentence, which is the fifth question. */
const SENTENCE = COUNT;
const TOTAL = COUNT + 1;
const LIMIT = 600;
/**
 * v1 held five answers in another order; it is not read back into this one.
 * The two ways came later inside v2, so a v2 sheet saved before them is read
 * back as the long way when anything was written in it.
 */
const KEY = "cor.bidul.v2";
/** The question the short way asks is this one of the four. */
const ONE = 3;

/** Not chosen yet, the one question, or all five. */
type Route = "" | "one" | "five";

type State = {
  route: Route;
  /** The answer on the short way. */
  quick: string;
  /** ISO time the short way's sheet was taken out, empty until then. */
  quickAt: string;
  /** 0 to 3 is a question, 4 is the sentence. */
  step: number;
  answers: string[];
  sentence: string;
  /** ISO time the sheet was taken out, empty until then. */
  doneAt: string;
};

const EMPTY: State = {
  route: "",
  quick: "",
  quickAt: "",
  step: 0,
  answers: ["", "", "", ""],
  sentence: "",
  doneAt: "",
};

type Action =
  | { type: "restore"; state: State }
  | { type: "choose"; route: Route }
  | { type: "quick"; text: string }
  | { type: "quickFinish"; at: string }
  | { type: "quickEdit" }
  | { type: "toFive" }
  | { type: "write"; index: number; text: string }
  | { type: "sentence"; text: string }
  | { type: "next" }
  | { type: "edit"; index: number }
  | { type: "finish"; at: string }
  | { type: "reopen" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "restore":
      return action.state;
    case "choose":
      return { ...state, route: action.route };
    case "quick":
      return { ...state, quick: action.text };
    case "quickFinish":
      return { ...state, quickAt: action.at };
    case "quickEdit":
      return { ...state, quickAt: "" };
    case "toFive": {
      // The short answer waits in its place among the five, unless that
      // place already holds one.
      const answers = state.answers.map((a, i) =>
        i === ONE && a.trim() === "" ? state.quick : a
      );
      return { ...state, route: "five", answers };
    }
    case "write":
      return {
        ...state,
        answers: state.answers.map((a, i) => (i === action.index ? action.text : a)),
      };
    case "sentence":
      return { ...state, sentence: action.text };
    case "next": {
      // On to the next question still empty, or to the sentence. The first
      // question may stay empty, so it is never gone back to.
      let step = SENTENCE;
      for (let i = state.step + 1; i < COUNT; i++) {
        if (state.answers[i].trim() === "") {
          step = i;
          break;
        }
      }
      return { ...state, step };
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
    const answers = v.answers.map((a) => text(a));
    const sentence = text(v.sentence);
    const doneAt = text(v.doneAt, 40);
    const wrote = answers.some((a) => a.trim() !== "") || sentence.trim() !== "" || doneAt !== "";
    const route: Route =
      v.route === "one" || v.route === "five" || v.route === ""
        ? v.route
        : wrote
          ? "five"
          : "";
    return {
      route,
      quick: text(v.quick),
      quickAt: text(v.quickAt, 40),
      step,
      answers,
      sentence,
      doneAt,
    };
  } catch {
    return null;
  }
}

type Question = { ask: string; why: string };

/**
 * The four questions before the sentence, in the approved order of states:
 * what is said today, one client and one real thing, the act and what was
 * seen, and the other professional, asked about the client's side.
 */
const QUESTIONS: Question[] = [
  {
    ask: "מה אתם עושים ללקוח? כתבו את זה כמו שאתם אומרים את זה היום.",
    why: "אפשר להדביק מהפרופיל או מהאתר, ואפשר גם לדלג. גם בפגישה אני מתחיל ממה שכבר כתבתם לעצמכם.",
  },
  {
    ask: "חשבו על לקוח אחד ועל דבר אחד ששלחתם לו או עשיתם איתו. אם הייתי שואל את הלקוח הזה מה עשיתם בשבילו, מה הוא היה אומר?",
    why: "כדאי לפתוח משהו אמיתי ששלחתם לו, הצעה, מצגת או הודעה. אם עוד אין לקוח, חשבו על מישהו שעבד איתכם באמת.",
  },
  {
    ask: "איזו מילה אחת ממה שהוא היה אומר הכי נכונה? מה עשיתם באותו רגע, ומה ראיתם שגרם לכם לעשות את זה?",
    why: "מספיק רגע אחד, גם קטן.",
  },
  {
    ask: "אם איש מקצוע אחר היה מטפל באותו לקוח ובאותה בעיה, מה היה שונה אצל הלקוח?",
    why: "כתבו את זה מהצד של הלקוח, מה היה קורה אצלו.",
  },
];

/** The fifth question, the sentence, asked only after the four. */
const SENTENCE_Q: Question = {
  ask: "כתבו את זה במשפט אחד, כאילו אני לקוח שלא מאמין לזה.",
  why: "אפשר להשתמש במילים שכבר כתבתם למעלה. אפשר גם להשאיר ריק ולחזור מחר.",
};

/**
 * The short way's one question: the fourth, with the client it is asked about
 * folded into it, since nothing before it has named one. Asked about a single
 * case, it is the form after which a sentence in the person's own words came
 * right away (the approved tree of states, state 4; n=1, so a hypothesis).
 */
const ONE_Q: Question = {
  ask: "חשבו על לקוח אחד ועל דבר אחד שעשיתם בשבילו. אם איש מקצוע אחר היה מטפל באותו לקוח ובאותה בעיה, מה היה שונה אצל הלקוח?",
  why: "כתבו את זה מהצד של הלקוח, מה היה קורה אצלו. כדאי לפתוח משהו אמיתי ששלחתם לו, הצעה, מצגת או הודעה.",
};

/** The short name of each row, on the sheet and in the message that carries it. */
const LABELS = [
  "מה שכתוב היום",
  "לקוח אחד ודבר אחד",
  "מה עשיתי ומה ראיתי",
  "מה היה שונה אצל איש מקצוע אחר",
];

/** The words on the draft in the hero. Each one is in the fixed list. */
const DRAFT_WORDS = ["מקצועי", "יחס אישי", "איכותי", "ניסיון רב"];

/** The reader's sentence without a closing mark; the page adds the point. */
function tailOf(sentence: string): string {
  return sentence.trim().replace(/[.!?…\s]+$/, "");
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
 * One stroke for each row of the sheet, read from the right like the page:
 * five on the long way (four questions and the sentence), one on the short.
 * Each one stands off true until its row is answered, then turns into line
 * and stops: the brand's one motion, and the sheet's progress mark. Ink only.
 * The copper point is kept for the headline, and for the reader's sentence
 * once it exists.
 */
const ANGLES = [-62, 34, -16, 48, -30] as const;

const Strokes = ({ settled, className }: { settled: boolean[]; className?: string }) => {
  const width = settled.length * 16 + 8;
  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      className={`bd-strokes ${className ?? ""}`}
      style={{ width: `${(width / 88) * 4.6}rem` }}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
        {settled.map((on, i) => {
          const cx = width - 12 - i * 16;
          return (
            <line
              key={i}
              x1={cx - 5}
              y1={12}
              x2={cx + 5}
              y2={12}
              style={{
                transform: `rotate(${on ? 0 : ANGLES[i % ANGLES.length]}deg)`,
                transformOrigin: `${cx}px 12px`,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

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

/**
 * One turn of a session moment, set as a line of a transcript: who spoke in
 * the margin, what was said beside it. A client's name is a struck-out bar.
 */
const Turn = ({ turn }: { turn: SessionTurn }) => (
  <>
    {turn.later && (
      <p className="bd-turn" data-who="gap">
        <span className="bd-turn__who" aria-hidden="true" />
        <span className="bd-turn__what">כמה שורות אחר כך</span>
      </p>
    )}
    <p className="bd-turn" data-who={turn.who}>
      <span className="bd-turn__who">
        {turn.who === "erez" ? (
          "ארז"
        ) : (
          <>
            <span className="bd-redact" aria-hidden="true" />
            <span className="sr-only">לקוח, השם מושחר</span>
          </>
        )}
        <span className="sr-only">: </span>
      </span>
      <span className="bd-turn__what">{turn.text}</span>
    </p>
  </>
);

const Bidul = () => {
  // The title is in the words people search with: business differentiation,
  // and a unique value proposition (Erez's choice, 2026-11-26).
  useDocumentMeta({
    title: "בידול עסקי לעצמאים בחמש שאלות | COR-SYS",
    description:
      "חמש השאלות שאני שואל עצמאים כשאנחנו מחפשים את הבידול העסקי שלהם. כעשר דקות, ובסוף יש לכם דף אחד וטיוטה של הצעת ערך ייחודית, במילים שלכם.",
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
  const chooseRef = useRef<HTMLHeadingElement>(null);
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

  const choosing = state.route === "";
  const onOne = state.route === "one";
  const done = state.doneAt !== "";
  const quickDone = state.quickAt !== "";
  /** The sheet on screen has been taken out, on whichever way. */
  const sheetDone = onOne ? quickDone : done;

  // Focus follows the reader: to the next field, to the finished sheet, or
  // back to the choice.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (choosing) chooseRef.current?.focus();
    else if (sheetDone) resultRef.current?.focus();
    else fieldRef.current?.focus();
  }, [state.step, state.route, choosing, sheetDone]);

  useEffect(() => {
    fit(fieldRef.current);
  }, [state.step, state.route, sheetDone, ready]);

  const onSentence = !onOne && state.step === SENTENCE;
  const current = onOne
    ? state.quick
    : onSentence
      ? state.sentence
      : state.answers[state.step];
  const startedFive =
    state.answers.some((a) => a.trim() !== "") || state.sentence.trim() !== "";
  const started = onOne ? state.quick.trim() !== "" : startedFive;
  const tail = tailOf(state.sentence);
  const settled = onOne
    ? [quickDone && state.quick.trim() !== ""]
    : [
        ...state.answers.map((a, i) => a.trim() !== "" && (done || state.step !== i)),
        done && tail !== "",
      ];

  // A general word in what is being written is quoted back, live. It never
  // blocks. The first answer is left alone, since it is meant to be what
  // already exists.
  const caught = !onOne && state.step === 0 ? [] : uniqueGeneralWords(current);
  const note = nudge
    ? "כתבו כמה מילים, ואז נמשיך."
    : caught.length > 0
      ? `כתבתם "${caught[0]}". גם מישהו אחר מהתחום היה כותב את זה. מה זה אומר אצלכם, בדוגמה אחת?`
      : "";

  // The sentence is the reader's alone: no lead of ours in front of it. The
  // short way has no sentence, only its one row.
  const fullSentence = onOne ? "" : tail;
  const lines: SheetLine[] = onOne
    ? [{ label: LABELS[ONE], text: state.quick }]
    : state.answers.map((text, i) => ({
        label: LABELS[i],
        text,
      }));
  // The same counted opening line on both ways (ACQ-N26), so a chat from
  // either one is counted.
  const waHref = whatsappSheetUrl(fullSentence, lines);
  const selfHref = () =>
    whatsappSelfUrl(fullSentence, lines, window.location.href.split("#")[0]);
  /* The chat links carry the reader's answers, and nothing that reads the page
     may see them. GA4 listens for outbound link clicks on the document, and
     Clarity records the address of every clicked link from a capture-phase
     listener, before any handler here runs, without scrubbing it in a masked
     region (clarity-js interaction/click.ts). So the address on the page holds
     no answers: the click writes them in just before the browser follows the
     link, and takes them out again right after. The chat opens as before. A
     right click fires auxclick before contextmenu on Windows, so only the
     middle button follows there; the menu itself gets the answers on
     contextmenu, after Clarity has read the address, so "copy link" and "open
     in new tab" still carry the sheet. */
  const keepToLink = (label: string, full: string) => {
    const bare = full.split("?")[0];
    const follow = (e: MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation();
      const a = e.currentTarget;
      a.href = full;
      window.setTimeout(() => {
        a.href = bare;
      });
    };
    return {
      href: bare,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => {
        trackCtaClick(label);
        follow(e);
      },
      onAuxClick: (e: MouseEvent<HTMLAnchorElement>) => {
        if (e.button === 1) follow(e);
      },
      onContextMenu: follow,
    };
  };
  const anyMarked =
    uniqueGeneralWords([fullSentence, ...lines.map((l) => l.text)].join("\n")).length > 0;

  // The first question may be skipped; the rest, and the short way's one
  // question, need a few words.
  const mayPass = !onOne && (onSentence || state.step === 0);

  const onChoose = (route: Route) => {
    setNudge(false);
    setAskClear(false);
    moveFocus.current = true;
    if (route) trackEvent("bidul_route", { route });
    dispatch({ type: "choose", route });
  };

  const onToFive = () => {
    setCopied("");
    moveFocus.current = true;
    trackEvent("bidul_route", { route: "five", from: "one" });
    dispatch({ type: "toFive" });
  };

  const onNext = () => {
    if (!mayPass && current.trim() === "") {
      setNudge(true);
      fieldRef.current?.focus();
      return;
    }
    setNudge(false);
    moveFocus.current = true;
    if (onOne) {
      trackEvent("bidul_one_complete");
      dispatch({ type: "quickFinish", at: new Date().toISOString() });
    } else if (onSentence) {
      trackEvent("bidul_complete", { with_sentence: tail !== "" });
      dispatch({ type: "finish", at: new Date().toISOString() });
    } else {
      trackEvent("bidul_step", { step: state.step + 1 });
      dispatch({ type: "next" });
    }
  };

  const onType = (text: string) => {
    if (nudge) setNudge(false);
    if (onOne) dispatch({ type: "quick", text });
    else if (onSentence) dispatch({ type: "sentence", text });
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
    dispatch(onOne ? { type: "quickEdit" } : { type: "reopen" });
  };

  const onStart = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick("bidul_start");
    // Focus inside the tap, so a phone raises its keyboard; then bring the
    // sheet under the fixed header.
    if (choosing) chooseRef.current?.focus({ preventScroll: true });
    else if (sheetDone) resultRef.current?.focus({ preventScroll: true });
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
    // Starting over goes back to the choice of the two ways.
    moveFocus.current = true;
    dispatch({ type: "reset" });
  };

  const startLabel = choosing
    ? "לבחור שאלה אחת או חמש"
    : sheetDone
      ? "לדף שלכם"
      : started
        ? "להמשיך מאיפה שעצרתם"
        : onOne
          ? "לשאלה"
          : "להתחיל בשאלה הראשונה";

  const progress = done ? "" : `שאלה ${state.step + 1} מתוך ${TOTAL}`;

  /** The open row: the question, the ruled field, the live note, the step on. */
  const field = (opts: {
    id: string;
    ask: string;
    why: string;
    lines: 2 | 4;
    button: string;
  }) => (
    <div className="ld-in">
      <h3 id={`${opts.id}-q`} className="bd-q mt-1.5">
        {opts.ask}
      </h3>
      <p id={`${opts.id}-why`} className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {opts.why}
      </p>

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

  /** Under the open sheet, on either way: speaking instead of typing, where
      the writing is kept, the way back to the choice, and starting over. */
  const notes = (
    <div className="bd-noprint mt-7 text-sm leading-relaxed text-foreground">
      <p>אפשר גם לדבר במקום להקליד, עם המיקרופון שבמקלדת של הטלפון.</p>
      <p className="mt-2">
        מה שאתם כותבים נשמר רק בדפדפן הזה, כדי שתוכלו לחזור אליו.
        הוא לא נשלח לשום מקום עד שתבחרו לשלוח.
      </p>
      {!started && (
        <button type="button" className="bd-textbtn mt-1" onClick={() => onChoose("")}>
          לחזור לבחירה
        </button>
      )}
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
  );

  /** Under a finished sheet: the foot that says what the marks are and are
      not, and the one question to put to a reader. */
  const sheetFoot = (what: "sentence" | "answer") => (
    <div className="bd-sheet-foot text-sm leading-relaxed text-muted-foreground">
      <p>
        {anyMarked
          ? "הקו הגלי מסמן מילים מרשימה קבועה של מילים כלליות. הדף לא מבין את הטקסט, והוא יכול לפספס מילה או לסמן בטעות."
          : what === "sentence"
            ? "הדף לא מצא כאן מילה מהרשימה הקבועה של מילים כלליות. הוא לא מבין את הטקסט, כך שזה עוד לא אומר שהמשפט חד."
            : "הדף לא מצא כאן מילה מהרשימה הקבועה של מילים כלליות. הוא לא מבין את הטקסט, כך שזה עוד לא אומר שהתשובה חדה."}
      </p>
      <p className="mt-2 text-foreground">
        {what === "sentence"
          ? "לפני שאתם משתמשים במשפט, הקריאו אותו לאדם אחד שמכיר את העבודה שלכם, ושאלו אותו מה הוא שמע."
          : "לפני שאתם משתמשים בתשובה, הקריאו אותה לאדם אחד שמכיר את העבודה שלכם, ושאלו אותו מה הוא שמע."}
      </p>
      <p className="mt-2 font-semibold text-foreground">חמש השאלות, ארז טל-שיר</p>
    </div>
  );

  /** The step to Erez, the copy, print and edit links, and the status line. */
  const sendRow = (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <a
          target="_blank"
          rel="noopener noreferrer"
          {...keepToLink(onOne ? "whatsapp_bidul_one" : "whatsapp_bidul_sheet", waHref)}
          className="ld-cta w-full shrink-0 sm:w-auto"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          לשלוח את הדף לארז בוואטסאפ
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
          {onOne ? "לערוך את התשובה" : "לערוך תשובות"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="bd-note text-sm font-semibold text-foreground">
        {copied === "ok"
          ? "הדף הועתק."
          : copied === "fail"
            ? "ההעתקה לא עבדה בדפדפן הזה. אפשר לסמן את הטקסט בדף ולהעתיק."
            : ""}
      </p>
    </>
  );

  /* The break a page cannot give: the sheet goes to the reader's own chat,
     with the way back to it. A function, since the link reads the address
     and is only built once a sheet is out. */
  const selfBlock = () => (
    <div className="mt-6 max-w-xl border-t border-foreground/15 pt-5 text-sm leading-relaxed text-foreground">
      <p>
        אצל ארבעה משבעת האנשים שליוויתי בבידול, המשפט הכי ברור
        הגיע רק בפגישה השנייה, אחרי הפסקה. הדף שמור בדפדפן הזה,
        ואפשר לשלוח אותו לעצמכם ולחזור אליו מחר.
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        {...keepToLink("whatsapp_bidul_self", selfHref())}
        className="bd-textbtn mt-1"
      >
        לשלוח את הדף לעצמי בוואטסאפ
        <span className="sr-only"> (נפתח בוואטסאפ)</span>
      </a>
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

              <p className="cor-overline-he mt-7 !text-base">בידול עסקי לעצמאים, שאלה אחת או חמש</p>

              <h1 id="bidul-title" className="cor-display mt-5 text-foreground">
                אני שואל חמש שאלות, ואתם כותבים למה בוחרים דווקא בכם
                <span className="cor-point">.</span>
              </h1>

              <p className="cor-body-lg mt-6 max-w-xl font-medium text-foreground">
                אלה השאלות שאני שואל עצמאים כשאנחנו מחפשים את הבידול שלהם.
                עוברים על לקוח אחד ועל דבר אחד שעשיתם בשבילו, ורק בסוף כותבים
                משפט. חמש השאלות לוקחות כעשר דקות, ואפשר גם לענות רק על אחת.
                אני לא כותב בדף אף מילה, כך שכל מה שיהיה בו יצא מכם.
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
          <div className={`mx-auto px-4 sm:px-6 ${choosing ? "max-w-5xl" : "max-w-3xl"}`}>
            {/* Before anything is written: two ways, each with what it asks,
                a real answer from a session, and what comes out of it. */}
            {choosing && (
              <div className="ld-in">
                <h2
                  id="sheet-title"
                  ref={chooseRef}
                  tabIndex={-1}
                  className="cor-title text-foreground"
                >
                  אפשר להתחיל בשאלה אחת, ואפשר בכל החמש.
                </h2>
                <p className="cor-body-lg mt-4 max-w-2xl text-foreground">
                  מה שכותבים נשאר בדפדפן שלכם. בסוף אפשר לשלוח את הדף לעצמכם,
                  או לי בוואטסאפ.
                </p>

                <ul className="bd-routes mt-8">
                  <li className="ld-sheet bd-route">
                    <p className="text-xs font-bold text-primary">שאלה אחת</p>
                    <h3 className="bd-q mt-1.5">
                      אם יש לכם זמן לשאלה אחת, זו השאלה שהייתי בוחר.
                    </h3>
                    <p className="bd-route__ask">{ONE_Q.ask}</p>

                    <div className="bd-eg">
                      <p className="bd-eg__label">כך נשמעת תשובה לשאלה כזו, מתוך פגישת בידול</p>
                      {routeExamples.one.map((turn) => (
                        <Turn key={turn.text} turn={turn} />
                      ))}
                    </div>

                    <p className="bd-route__label">מה יוצא</p>
                    <p className="bd-route__out mt-1 text-sm leading-relaxed text-foreground">
                      דף עם התשובה שלכם. ממנו אפשר להמשיך לשאר השאלות, והתשובה
                      תחכה שם.
                    </p>
                    <button
                      type="button"
                      className="ld-cta bd-route__go w-full sm:w-auto"
                      onClick={() => onChoose("one")}
                    >
                      לענות על שאלה אחת
                    </button>
                  </li>

                  <li className="ld-sheet bd-route">
                    <p className="text-xs font-bold text-primary">כל חמש השאלות</p>
                    <h3 className="bd-q mt-1.5">
                      בסוף כותבים משפט אחד במילים שלכם, למה לבחור דווקא בכם.
                    </h3>
                    <p className="bd-route__ask">
                      כעשר דקות, בסדר שאני עובר עליו עם עצמאים בפגישת בידול.
                    </p>
                    <ol className="bd-route__steps">
                      {[...LABELS, "המשפט, במילים שלכם"].map((label, i) => (
                        <li key={label}>
                          {label}
                          {i === 0 && <span className="text-muted-foreground">, אפשר לדלג</span>}
                        </li>
                      ))}
                    </ol>

                    <div className="bd-eg">
                      <p className="bd-eg__label">מאותה פגישה, על מה שנעשה בשביל הלקוח</p>
                      {routeExamples.five.map((turn) => (
                        <Turn key={turn.text} turn={turn} />
                      ))}
                    </div>

                    <p className="bd-route__label">מה יוצא</p>
                    <p className="bd-route__out mt-1 text-sm leading-relaxed text-foreground">
                      דף עם המשפט שלכם בראש, וארבע התשובות מתחתיו.
                    </p>
                    <button
                      type="button"
                      className="ld-cta bd-route__go w-full sm:w-auto"
                      onClick={() => onChoose("five")}
                    >
                      לעבור על חמש השאלות
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* The short way: the one question, on a sheet of one row. */}
            {onOne && !quickDone && (
              <>
                <div className="ld-sheet ld-stack bd-print">
                  <div className="bd-sheet-head">
                    <div className="bd-sheet-title">
                      <h2
                        id="sheet-title"
                        className="font-heading text-2xl font-black text-foreground"
                      >
                        שאלה אחת
                      </h2>
                    </div>
                    <Strokes settled={settled} className="text-foreground" />
                  </div>
                  <div className="bd-row" data-state="open">
                    <span className="bd-row__n" aria-hidden="true" />
                    <div className="bd-row__body">
                      <p className="text-xs font-bold text-primary">{LABELS[ONE]}</p>
                      {field({
                        id: "bidul-one",
                        ask: ONE_Q.ask,
                        why: ONE_Q.why,
                        lines: 4,
                        button: "להוציא את הדף",
                      })}
                    </div>
                  </div>
                </div>
                {notes}
              </>
            )}

            {onOne && quickDone && (
              <>
                <article className="ld-sheet ld-stack bd-print ld-in" aria-labelledby="sheet-title">
                  <div className="bd-sheet-head">
                    <p className="text-sm font-bold text-primary">
                      דף עבודה, {dateLabel(state.quickAt)}
                    </p>
                    <Strokes settled={settled} className="text-foreground" />
                  </div>
                  <div className="bd-row" data-state="kept">
                    <span className="bd-row__n" aria-hidden="true" />
                    <div className="bd-row__body">
                      <h2
                        id="sheet-title"
                        ref={resultRef}
                        tabIndex={-1}
                        className="text-xs font-bold text-primary"
                      >
                        {LABELS[ONE]}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {ONE_Q.ask}
                      </p>
                      <p className="bd-answer mt-2">
                        <Marked text={state.quick} />
                      </p>
                    </div>
                  </div>
                  {sheetFoot("answer")}
                </article>

                <div className="bd-noprint mt-8">
                  {sendRow}

                  {/* The long way, with this answer already in its place. */}
                  <div className="mt-6 max-w-xl border-t border-foreground/15 pt-5 text-sm leading-relaxed text-foreground">
                    <p>
                      בחמש השאלות כותבים בסוף משפט אחד במילים שלכם, למה לבחור
                      דווקא בכם. התשובה הזו כבר תחכה שם, בשאלה הרביעית.
                    </p>
                    <button type="button" className="bd-textbtn mt-1 font-bold" onClick={onToFive}>
                      להמשיך לחמש השאלות
                    </button>
                  </div>

                  {selfBlock()}
                </div>
              </>
            )}

            {state.route === "five" && !done && (
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
                    {QUESTIONS.map((q, i) => {
                      const open = i === state.step;
                      const kept = !open && state.answers[i].trim() !== "";
                      const label = LABELS[i];
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
                                button:
                                  i === 0 && current.trim() === ""
                                    ? "לדלג לשאלה הבאה"
                                    : "להמשיך",
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
                          ask: SENTENCE_Q.ask,
                          why: SENTENCE_Q.why,
                          lines: 2,
                          button: "להוציא את הדף",
                        })
                      ) : (
                        <p className="bd-lead mt-1" data-ahead="">
                          <span className="bd-blank" aria-hidden="true" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {notes}
              </>
            )}

            {state.route === "five" && done && (
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
                      {tail ? (
                        <Marked text={tail} />
                      ) : (
                        <>
                          <span className="bd-blank" aria-hidden="true" />
                          <span className="sr-only">המשפט עוד לא נכתב</span>
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

                  {sheetFoot("sentence")}
                </article>

                <div className="bd-noprint mt-8">
                  {sendRow}
                  {selfBlock()}
                </div>
              </>
            )}
          </div>
        </section>

        {/* How it sounds inside a session: two moments off the transcripts,
            with nobody named. */}
        <section aria-labelledby="talk-title" className="bd-noprint bd-talk-band ld-section">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 bd-cols-b md:gap-14">
            <div>
              <SectionHead label="מתוך השיחות" />
              <h2 id="talk-title" className="cor-title mt-6 text-foreground">
                כך זה נשמע בתוך השיחה.
              </h2>
              <p className="cor-body-lg mt-5 max-w-xl text-foreground">
                אלה שני רגעים מתוך התמלולים שלי, מילה במילה, ואת השמות
                השחרתי.
              </p>
            </div>
            <ul className="ld-sheet bd-talk">
              {sessionMoments.map((turns) => (
                <li key={turns[0].text} className="bd-moment">
                  {turns.map((turn) => (
                    <Turn key={turn.text} turn={turn} />
                  ))}
                </li>
              ))}
            </ul>
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

              {/* Masked like the sheet: once it is done, this link's address
                  holds the answers. */}
              <div
                data-clarity-mask="true"
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
              >
                {sheetDone ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...keepToLink("whatsapp_bidul_between", waHref)}
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
                    {started ? "לחזור לדף ולסיים" : startLabel}
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
                בליווי של 30 יום אנחנו בונים יחד את המשפט, את התמחור ואת הפנייה
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
              <p className="cor-body-lg mt-4 max-w-xl text-foreground">
                גם הסדר של השאלות בא משם. כששאלתי ישר מה מבדל אותם, אף אחד
                משבעת האנשים שליוויתי לא ענה במשפט משלו. המשפט הגיע כשדיברנו
                על לקוח אחד, ואחר כך על מה שהיה שונה אצלו עם איש מקצוע אחר,
                או כשביקשתי להגיד את זה ללקוח שלא מאמין.
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
