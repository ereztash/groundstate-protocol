# Publishable case records

`src/lib/caseChain.ts` globs `*.json` here **eagerly**, which means Vite inlines
every file in this directory into the production bundle whether or not anything
renders it.

That is the trap this directory exists to close. The consent and
source-integrity checks in `caseChain.ts` are *rendering* gates: they correctly
refused to draw `C1`, whose `consent_state` is `pending`, while the bundler had
already copied the whole record, the client's pricing problem, what was built,
and the ₪5,500 line, into a JavaScript file any visitor can read. The record's own
caveat says the domain was generalised "כדי שלא יזוהה בשוק קטן", which is a
statement that identification was a real risk, and a gate that stops at render
does nothing about it.

So location is now the first gate, ahead of the code:

- **A record only belongs here once `consent_state` is `granted` AND
  `source_integrity_confirmed` is `true`.** Being here means publishable.
- Records still waiting on either live in `docs/cases/`, which no bundle reads.

`src/data/cases.test.ts` fails if a file here does not pass both gates, and
`e2e/case-intake.spec.ts` fails if unconsented case text reaches `dist/`. The
runtime gates in `caseChain.ts` stay exactly as they are: they are the second
line, not the only one.
