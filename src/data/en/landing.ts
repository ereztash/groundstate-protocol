/**
 * The English home page's copy, for English speakers in Israel (Erez's
 * decision, 2026-10-01): the same offer, the same price in shekels, the same
 * calendar. Everything here translates the Hebrew page as it stood after v4
 * (PR #105); nothing is promised that the Hebrew page does not promise, with
 * one exception marked below (the meeting language), which Erez confirms
 * before this ships.
 *
 * Numbers and prices are read from the same sources as the Hebrew page, so a
 * price change reaches both. Client words are translated and say so on the
 * page; the originals stay in src/lib/clients.ts.
 *
 * House rules hold in English too: no "!" in Erez's own sentences, no em or en
 * dashes (src/lib/noDashes.test.ts scans this file), no hype words.
 */
import { outreachCount, program } from "@/data/sprint-stages";

export const PRICE = {
  label: program.priceLabel,
  installments: "in two payments of ₪2,000",
  /** Erez is an exempt dealer: the price is final (see program.vatLabel). */
  vat: "final, no VAT",
} as const;

export const hero = {
  overline: "Business mentoring for freelancers · 30 days",
  title: "You know how to do the work. You don't know how to sell it",
  subtitle: `In four meetings over a month, what you already know is packaged as one product with a price, and goes out to ${outreachCount} people you know by name.`,
  cta: "Book a fit call",
  // The meeting language is the one line with no Hebrew original: an English
  // page has to say it. Confirmed by Erez before merge.
  ctaNote: "30 minutes, free. Pick a time in the calendar, in English or Hebrew, or",
  ctaNoteWhatsapp: "message me on WhatsApp",
  priceTerm: "The whole program",
  meetingsTerm: "Meetings",
  meetingsValue: "4, one a week",
  guaranteeLabel: "Signed guarantee",
  guarantee: `If by the end of meeting 4 you don't have a sales unit (a product, a duration and a fixed price) and ${outreachCount} outreach messages actually sent with it to the target audience we defined, I refund the payment in full.`,
  guaranteeLink: "Full wording",
  quote:
    "It helped me sharpen my value proposition, and I feel it in my conversion rates almost every day.",
  translated: "Translated from Hebrew",
  name: "Erez Tal-Shir",
  role: "Social worker and technologist, business consultant for freelancers",
  portraitAlt:
    "Portrait: a man in a dark coat and a white shirt, looking straight at the camera, against an olive green background.",
} as const;

export const why = {
  label: "Why you're here",
  title: "Brilliant about your clients. Stuck on yourself.",
  trigger:
    "It usually comes after you've left a job, gone on unpaid leave, or while the income from the business isn't steady yet.",
  notes: [
    ["You know exactly what you do for clients. When someone new asks ", "what you sell", ", the answer still isn't clear, even to you."],
    ["Every few weeks you open LinkedIn and change your headline. There are already ", "15 versions", " of “who I am”, and each one, a month later, is “not quite right”."],
    ["You wrote a number down before the call. When it was time to say it out loud, you hesitated, and ", "a lower number", " came out."],
    ["You gave half an hour of advice to a friend's cousin. When your product is your knowledge, ", "you gave it away", "."],
  ] as const,
  diagnosis: "These four look like four separate problems. They are four faces of one thing: ",
  diagnosisMark: "you haven't yet translated what you know into the language your client pays for.",
  cost: "And every month it stays that way has a price: deals that close below their value, clients who don't see why it should be you, and another version of “who I am” that won't hold. Time alone doesn't translate. It only makes it cost more.",
} as const;

export const offer = {
  label: "What you leave with",
  title: "Four weeks. Four documents. Each one built on the last.",
  intro: "At the end of every week there is a document you can use the next morning. The wording comes from you, so it stays yours.",
  swipe: "Four documents, swipe between them →",
  week: "Week",
  sampleNote: "Example, not a client",
  stages: [
    {
      name: "Unique narrative",
      title: "One sentence that still holds in six months",
      deliverable: "A narrative document of one to two pages, with 3 to 5 ready wordings.",
      benefit: "So you stop changing your headline every three weeks, and say the same sentence six months from now.",
      sample: "I help consultants turn 20 years of experience into one sentence they say without hesitating.",
      doc: "Narrative document",
    },
    {
      name: "Unique value proposition",
      title: "The words your clients already use",
      deliverable: "A core sentence and a pain dictionary, ready to send.",
      benefit: "So you stop guessing which pain gets a client interested, and write in words they have already said.",
      sample: "What a client says: “my wording is stuck”. What I hear: “the offer isn't sharp.”",
      doc: "Value proposition",
    },
    {
      name: "Unique product",
      title: "A product with a price you can say out loud",
      deliverable: "A product description with pricing and its rationale, ready to send.",
      benefit: "So the client understands what they are buying before they ask what it costs.",
      sample: "A 4-meeting, 30-day track. An asset that still works a year from now.",
      doc: "Product description",
    },
    {
      name: "Proactive client acquisition",
      title: `${outreachCount} messages to people you know by name`,
      deliverable: `${outreachCount} outreach messages written and logged, and a guided run of the first one in the room. A buying-signals log to track the replies.`,
      benefit: "So the documents leave your computer and reach people you know by name, instead of staying a plan.",
      sample: "Subject: I saw what you wrote about the Q2 crunch. One question.",
      doc: `${outreachCount} logged outreach messages`,
    },
  ],
  proposal: "Proposal: the full program",
  lineItems: [
    "4 meetings of 60 minutes, over 30 days",
    "Support between meetings",
    "4 documents that stay with you",
    "A guided run of the first outreach message",
  ],
  included: "Included",
  total: "Total",
  spots: "I take up to 10 clients a month.",
  cta: "Book a fit call",
  ctaNote: "In the call we check whether there's a fit and where to start. If there isn't, we say so.",
  clauseLabel: "Guarantee clause",
  clause: `By the end of the program you will have one sales unit, with a product, a duration and a fixed price, and ${outreachCount} active outreach messages actually sent with it to the target audience we defined. If both aren't in place by the end of meeting 4, I refund the payment in full.`,
  countsLabel: "What counts",
  counts: [
    "Sales unit: a product, a duration and a fixed price. The same unit goes to the next client without being rebuilt.",
    "Active outreach: actually sent to the target audience we defined, with the same unit and the same price.",
  ],
  countsNote: "Both are required by the end of meeting 4.",
  notGuaranteedLabel: "What isn't guaranteed",
  notGuaranteed: "A reply from the recipients, a meeting or a deal. Those depend on a third party.",
} as const;

export const day31 = {
  label: "After",
  title: "Day 31",
  lines: [
    "Someone asks what you do. You have one sentence. You say it, and you don't add a disclaimer after it.",
    "They ask what it costs. The number is written in your document, so it comes out as it is. Without checking their face first.",
    `And the ${outreachCount} messages are already out, each one to a person you know by name.`,
  ],
  caveat: "This is what the four documents are meant to make possible: a description of what has to be in your hands for it to be possible. There is no promise here that it will happen. What happens next also depends on the market, and on the people you chose to approach.",
} as const;

export const proof = {
  label: "In their words",
  title: "What three people who worked with me said.",
  translated: "Translated from Hebrew.",
  more: "Read the full testimonial",
  less: "Close",
  evidence: "What has been checked and what hasn't, including what I committed in advance to measure:",
  evidenceLink: "on the protocol page (in Hebrew)",
  opensLinkedIn: " (opens LinkedIn)",
} as const;

/** Keyed by the Hebrew attribution in src/lib/clients.ts, which holds the originals. */
export const testimonialsEn: Record<string, { name: string; quote: string; pullQuote?: string; outcome?: string }> = {
  "גיא כהן": {
    name: "Guy Cohen",
    quote: "Erez doesn't just hand you a solution. He guides you to think more deeply about who you are and what you've been through, and he spots it very quickly. It helped me sharpen my value proposition, and I feel it in my conversion rates almost every day.",
    outcome: "AI consultant for freelancers · leads a community of 1,500+",
  },
  "נועם אורן": {
    name: "Noam Oren",
    quote: "Erez is simply a pro! Already in the first meeting he brought up insights I wouldn't have reached without him. Erez is sensitive, smart, sophisticated, and has broad, deep knowledge. You can feel how dedicated and committed he is, and that he truly sets out to lead the client to change and growth. I recommend him.",
    outcome: "Customer Success Manager at Movement Group",
  },
  "סמואל די פורטו": {
    name: "Samuel Di Porto",
    pullQuote: "I warmly recommend him to anyone who wants results and not just promises",
    quote: "I came to Erez after a long and especially exhausting period of searching, and he simply changed my perspective. Instead of “shooting in every direction” with hundreds of CVs, he helped me focus on what I'm really strong at and turn it into a working tool in the field. Erez goes into the smallest details, and his method is built on his very impressive practical and academic experience. He knew how to identify exactly where my strengths were and where I needed to improve, and gave me confidence in the way I present myself. He helped me “target” the jobs I was aiming for, and in particular the people I needed to connect with to reach them. But what really warmed my heart, beyond the professionalism: he is first of all a person who talks to you at eye level, a kind man who tries to help in every way he can, who supports reservists and moves us forward on our very complicated way back home, and who never looks at the clock when he talks to you. I warmly recommend him to anyone who wants results and not just promises, and above all to anyone who wants to talk to a human being and not to a wallet waiting for your money.",
  },
};

export const fit = {
  label: "Fit",
  title: "This isn't for everyone, and that's fine.",
  forTitle: "It's for you if",
  for: [
    "Something changed recently: you left a job, went on unpaid leave, or your income isn't steady yet, and the question of what you sell became urgent.",
    "You already have clients, and they're happy. The hard part is explaining to someone who hasn't worked with you why it should be you.",
    "You combine two worlds, and can't say the combination in one sentence.",
    "You're ready for a meeting a week and a short task between meetings, for a month.",
  ],
  notForTitle: "It's not for you if",
  notFor: [
    "You mainly serve corporations, not freelancers.",
    "You already have 30+ active clients and want to filter.",
    "You're used to working by feel rather than by structure. This will feel annoying.",
    "You're looking for emotional warm-up before action. I'm not the right person for that.",
  ],
  whoLabel: "Who you'll be talking to",
  whoTitle: "I had knowledge too. And I didn't know how to get it across.",
  whoBody: "For years I held only the human side, story and narrative. When I entered the business world, I found that I know things others don't, and also that I had no idea how to explain it to a client. I found that structure is the other half of the same shape.",
  whoLink: "More about me (in Hebrew)",
} as const;

export const faqEn = {
  label: "Questions",
  title: "What people ask before booking.",
  surfaced: [
    {
      q: "Can't I just use GPT?",
      a: "You've tried “help me sharpen how I describe myself”, and a month later it's “not quite right” again. GPT hands you back yourself with more words: it knows what you told it. I draw out what you didn't tell it, the difference between you and a thousand others who do the same thing.",
    },
    {
      q: "What's the difference between you and a business consultant or a business coach?",
      a: "Maybe you've already worked with someone who “knew the field less and was more general”. A consultant gives advice. A coach asks questions. I draw out a narrative, word a value proposition, build a product, and run the outreach with you. At the end of each stage there's a document you can use the next morning.",
    },
  ],
  rest: [
    {
      q: "Are the meetings in English?",
      a: "Yes, in English or in Hebrew, whichever you're more at home in. The documents are written in the language your clients buy in.",
    },
    {
      q: "Where do I start if I'm not sure which stage I'm at?",
      a: "That's exactly what the first call does. Stage 1 (narrative) is where the differentiation that hasn't been put into words yet sits. If you already have a clear narrative, we skip ahead and start from the value proposition. You don't have to decide alone.",
    },
    {
      q: "I already have a narrative. Can I start from stage 2?",
      a: "Yes. In the call we check that your existing narrative meets the conditions, and if it does, we start from stage 2.",
    },
    {
      q: "What if stage 1 doesn't give me what I expected?",
      a: "If the narrative isn't clear or accurate, we don't continue. I don't sell a sequence that starts with a failure.",
    },
    {
      q: "Is thirty days realistic while I keep working?",
      a: "Four meetings in four weeks. Between meetings there are short tasks. If a week is too full, we move the meeting to the next week. The schedule is flexible; only the order matters.",
    },
    {
      q: "What does stage 4 include in practice?",
      a: "Mapping five specific decision makers in your market, a separate message for each of them, and a guided run of the first one in the room. The buying-signals log is built to record what keeps coming back in the replies.",
    },
    {
      q: "How much does the program cost?",
      a: `${program.priceLabel} for the whole program, in two payments of ₪2,000. The price is final, with no VAT. Four meetings and support between them. The stages aren't sold separately.`,
    },
  ],
} as const;

export const book = {
  label: "Next step",
  title: "A fit call. 30 minutes, free.",
  intro: "If it's not the right time, or I'm not the right person, we'll say so honestly without wasting anyone's time.",
  stepsTitle: "What happens in the thirty minutes",
  stop: "Stop",
  steps: [
    ["Opening.", "What's stuck, and what you've tried so far."],
    ["Drawing out one point.", "Something specific you once did and are proud of. That's where the differentiation sits."],
    ["Reflection.", "I say out loud what I hear, and we correct it together."],
    ["Decision.", "Whether it fits, and where to start. If not, that's a clear answer too."],
  ] as const,
  questionLabel: "One question to bring to the call",
  question: "If someone else offers exactly the same service, why would they choose you?",
  questionNote: "If the answer takes more than a sentence, that's what the call is for.",
  whatsappLead: "Rather write?",
  loading: "The calendar is loading.",
  openCalendar: "Open the calendar in a new window",
  sticky: "Book a fit call · 30 min",
} as const;

export const meta = {
  title: "Business mentoring for freelancers: message, offer and pricing in 30 days | Erez Tal-Shir",
  description: `For freelancers who know their craft and don't know how to sell it. 30 days, 4 meetings, and at the end: a clear message, a price you can say out loud, and ${outreachCount} messages to real people.`,
} as const;
