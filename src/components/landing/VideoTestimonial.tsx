import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const VIDEO_SRC = `${import.meta.env.BASE_URL}media/testimonial-guy.mp4`;
const POSTER_SRC = `${import.meta.env.BASE_URL}media/testimonial-guy-poster.webp`;
const CAPTIONS_SRC = `${import.meta.env.BASE_URL}media/testimonial-guy.he.vtt`;

/**
 * Video testimonial with a "facade" load pattern: the poster image + a
 * play button render immediately (cheap), and the actual <video> element
 * only mounts on click. This keeps the heavy MP4 (~1.8 MB) off the
 * critical path so it never competes with LCP — nothing video-related
 * downloads until the visitor chooses to watch.
 *
 * The transcribed pull-quote sits alongside so the testimonial still
 * "works" for muted scanners, screen readers, SEO crawlers, and AI
 * engines that don't watch video.
 */
const VideoTestimonial = () => {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    trackEvent("video_testimonial_play", { person: "guy_cohen" });
    setPlaying(true);
  };

  return (
    <figure className="grid gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center sm:gap-8">
      <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_24px_-12px_hsl(var(--foreground)/0.18)]">
        <div className="relative aspect-[474/850]">
          {/* Hebrew captions ship as a VTT track (default on). The pull-quote
              beside the video still carries the gist for muted scanners,
              crawlers, and AI engines that don't play video. */}
          {playing ? (
            <video
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full bg-black"
            >
              <track
                kind="captions"
                srcLang="he"
                label="עברית"
                src={CAPTIONS_SRC}
                default
              />
            </video>
          ) : (
            <button
              type="button"
              onClick={play}
              aria-label="נגן את עדות הווידאו של גיא כהן (37 שניות)"
              className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <img
                src={POSTER_SRC}
                alt="גיא כהן ממליץ על COR-SYS"
                className="h-full w-full object-cover"
                loading="lazy"
                width={474}
                height={850}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-foreground/10 transition-colors group-hover:bg-foreground/[0.18]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/95 shadow-lg ring-1 ring-border transition-transform group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    className="ms-0.5 h-6 w-6 fill-primary"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="space-y-4">
        <blockquote className="pull-quote pr-8 md:pr-10">
          <p>
            ארז לא רק נותן פתרון — הוא מנחה אותך לחשוב עמוק יותר מי אתה ומה עברת, ומזהה את זה מהר מאוד. זה עזר לי למקד את הצעת הערך שלי, ואני מרגיש את זה באחוזי ההמרה כמעט כל יום.
          </p>
        </blockquote>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] text-sm font-semibold text-foreground/70 ring-1 ring-border"
          >
            גכ
          </span>
          <div className="space-y-0.5">
            <a
              href="https://www.linkedin.com/in/guycohen-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              גיא כהן
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-current text-primary/70"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              <span className="sr-only">(נפתח בלינקדאין)</span>
            </a>
            <p className="text-xs leading-relaxed text-muted-foreground">
              יועץ AI לעצמאים · מוביל קהילה של 1,500+
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default VideoTestimonial;
