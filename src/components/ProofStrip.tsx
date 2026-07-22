import { approvedClients } from "@/lib/clients";

/**
 * Compact, verifiable proof band for use on any page. Names link to LinkedIn
 * (third-party validation — one of NN/g's four credibility factors). Reads the
 * shared, consented client list so it never drifts from the landing page.
 */
const ProofStrip = ({ className }: { className?: string }) => {
  return (
    <div dir="rtl" className={className}>
      <p className="cor-overline-he">מי שכבר עבר את זה</p>
      <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3">
        {approvedClients.map((c) => (
          <li key={c.name} className="border-t border-border pt-3">
            <a
              href={c.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {c.name}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-current text-primary/70"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              <span className="sr-only">(נפתח בלינקדאין)</span>
            </a>
            {c.credential && (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {c.credential}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProofStrip;
