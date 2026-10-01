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
  overline: "Business mentoring for freelancers, 30 days",
  title: "You know the work, and the hard part is selling it",
  subtitle: `In four meetings over a month we turn what you already know into one product with a price, and you send it to ${outreachCount} specific people.`,
  cta: "Book a fit call",
  // The meeting language is the one line with no Hebrew original: an English
  // page has to say it. Confirmed by Erez before merge.
  ctaNote: "30 minutes, free. Pick a time in the calendar, in English or Hebrew, or",
  ctaNoteWhatsapp: "message me on WhatsApp",
  priceTerm: "The whole program",
  meetingsTerm: "Meetings",
  meetingsValue: "4, one a week",
  guaranteeLabel: "My commitment, in writing",
  guarantee: `If by the end of meeting 4 you don't have one product with a duration and a fixed price, and ${outreachCount} outreach messages actually sent with it to the target audience we defined, I refund the payment in full.`,
  guaranteeLink: "Full wording",
  quote:
    "For me it helped a lot to sharpen my value proposition, and I feel it in my conversion rates almost every day.",
  translated: "Translated from Hebrew",
  name: "Erez Tal-Shir",
  role: "Social worker and technologist, business consultant for freelancers",
  portraitAlt:
    "Portrait: a man in a dark coat and a white shirt, looking straight at the camera, against an olive green background.",
} as const;

export const why = {
  label: "Why you're here",
  title: "The cobbler's children have no shoes, and that goes for me too.",
  trigger:
    "It usually comes after you've left a job, gone on unpaid leave, or while the income from the business isn't steady yet.",
  notes: [
    ["When someone new asks ", "what you sell", ", it's hard to tell them what they're buying and what they get out of it."],
    ["Every few weeks you open LinkedIn and change your headline. There are already ", "15 versions", " of “who I am”, and each one, a month later, is “not quite right”."],
    ["You wrote a number down before the call. When it was time to say it out loud, you hesitated, and ", "a lower number", " came out."],
    ["You gave half an hour of advice to a friend's cousin. When your product is your knowledge, ", "you gave it away", "."],
  ] as const,
  diagnosis: "I think these four things have one cause. ",
  diagnosisMark: "You haven't yet taken what you know and framed it as something someone will pay for.",
} as const;

export const offer = {
  label: "What you leave with",
  title: "Four meetings, each one built on the last.",
  intro: "At the end of every week there is a document you can use the next morning. I'm careful not to put words in your mouth.",
  swipe: "Four documents, swipe between them →",
  week: "Week",
  sampleNote: "Example, not a client",
  stages: [
    {
      name: "Narrative",
      title: "One sentence that still holds in six months",
      deliverable: "A narrative document of one or two pages, with 3 to 5 ready wordings.",
      benefit: "So you stop changing your headline every three weeks.",
      sample: "I help consultants turn 20 years of experience into one sentence they say without hesitating.",
      doc: "Narrative document",
    },
    {
      name: "Value proposition",
      title: "The words your clients already use",
      deliverable: "A sentence ready to send, and a list of your clients' pains.",
      benefit: "The more you speak your client's language, the less effort it takes to explain what you do.",
      sample: "What a client says: “my wording is stuck”. What I hear: “the offer isn't sharp.”",
      doc: "Value proposition",
    },
    {
      name: "Product",
      title: "A product with a price you can say out loud",
      deliverable: "A product description with pricing and its rationale, ready to send.",
      benefit: "So the client understands what they are buying before they ask what it costs.",
      sample: "A 4-meeting, 30-day track. An asset that still works a year from now.",
      doc: "Product description",
    },
    {
      name: "Outreach",
      title: `${outreachCount} messages to decision makers in your market`,
      deliverable: `${outreachCount} written, logged outreach messages. We go through the first one together in the meeting, and you log the replies.`,
      benefit: "So the documents leave your computer and reach the people you chose.",
      sample: "Subject: I saw what you wrote about the Q2 crunch. One question.",
      doc: `${outreachCount} logged outreach messages`,
    },
  ],
  proposal: "Proposal: the full program",
  lineItems: [
    "4 meetings of 60 minutes, over 30 days",
    "Support between meetings",
    "4 documents that stay with you",
    "Going through the first message together",
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
  title: "On day 31",
  lines: [
    "Someone asks what you do, and you have one sentence you can say without first explaining your whole philosophy.",
    "They ask what it costs. The number is written in your document, so it comes out as it is. Without checking their face first.",
    `And the ${outreachCount} messages are already out, each one to a specific person.`,
  ],
  caveat: "There is no promise here that it will happen. What happens next also depends on the market, and on the people you chose to approach.",
} as const;

export const proof = {
  label: "Testimonials",
  title: "What three people who worked with me said.",
  translated: "Translated from Hebrew.",
  more: "Read the full testimonial",
  less: "Close",
  evidence: "What I've checked and what I haven't,",
  evidenceLink: "on the protocol page (in Hebrew)",
  opensLinkedIn: " (opens LinkedIn)",
} as const;

/** Keyed by the Hebrew attribution in src/lib/clients.ts, which holds the originals. */
export const testimonialsEn: Record<string, { name: string; quote: string; pullQuote?: string; outcome?: string }> = {
  "גיא כהן": {
    name: "Guy Cohen",
    quote: "Erez is a person who won't just tell you what the solution is, he'll guide you to think more deeply about who you are and what you've been through in this life, and he'll spot it very quickly. He'll get you to offer a value proposition that speaks both to you and to the audience you want to reach. For me it helped a lot to sharpen my value proposition, and I feel it in my conversion rates almost every day.",
    outcome: "AI consultant for freelancers, leads a community of 1,500+",
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
  title: "Who it fits, and who it fits less.",
  forTitle: "It fits you if",
  for: [
    "You left a job, went on unpaid leave or your income isn't steady yet, and now the question of what you sell is pressing.",
    "You already have clients, and they're happy. The hard part is explaining to someone who hasn't worked with you why it should be you.",
    "You combine two worlds, and can't explain the combination in one sentence.",
    "You're ready for a meeting a week and a short task between meetings, for a month.",
  ],
  notForTitle: "It fits you less if",
  notFor: [
    "You mainly serve corporations, not freelancers.",
    "You already have 30+ active clients and want to filter.",
    "You're used to working by feel, and working by structure will annoy you.",
    "You mainly want someone to hold your hand, and that's less my thing.",
  ],
  whoLabel: "Who you'll be talking to",
  whoTitle: "I do this because I've been exactly there.",
  whoBody: "I had knowledge and experience from many fields, and I didn't understand how to turn all of it into one thing someone would pay for. I spent a long time trying to figure it out, and that's where the process I use today came from.",
  whoLink: "More about me (in Hebrew)",
} as const;

export const faqEn = {
  label: "Questions",
  title: "What people ask before booking.",
  surfaced: [
    {
      q: "Can't I just use GPT?",
      a: "You've tried “help me sharpen how I describe myself”, and a month later it's “not quite right” again. GPT hands you back yourself with more words.",
    },
    {
      q: "What's the difference between you and a business consultant or a business coach?",
      a: "Maybe you've already worked with someone who “knew the field less and was more general”. With me the order is fixed. First we find what is special about you, then we build a product with a price from it, and then we go out with the outreach. At the end of each stage you keep a document.",
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
      a: "Mapping five specific decision makers in your market, a separate message for each of them, and we go through the first one together in the meeting. You log the replies, to see what keeps coming back.",
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
  stepsTitle: "What happens in the thirty minutes",
  stop: "Stop",
  steps: [
    ["Opening.", "What's stuck, and what you've tried so far."],
    ["Drawing out one point.", "Something specific you once did and are proud of."],
    ["Reflection.", "I say out loud what I hear, and we correct it together."],
    ["Decision.", "Whether it fits, and where to start. If not, that's a clear answer too."],
  ] as const,
  questionLabel: "One question to bring to the call",
  question: "If someone else offers exactly the same service, why would they choose you?",
  questionNote: "If the answer takes more than a sentence, that's what the call is for.",
  whatsappLead: "Rather write?",
  loading: "The calendar is loading.",
  openCalendar: "Open the calendar in a new window",
  sticky: "Book a fit call, 30 min",
} as const;

export const meta = {
  title: "Business mentoring for freelancers: message, offer and pricing in 30 days | Erez Tal-Shir",
  description: `For freelancers who know their craft and don't know how to sell it. 30 days, 4 meetings, and at the end: a clear message, a price you can say out loud, and ${outreachCount} messages to real people.`,
} as const;
