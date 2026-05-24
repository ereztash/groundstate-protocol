import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const VIDEO_SRC = `${import.meta.env.BASE_URL}media/testimonial-guy.mp4`;
const POSTER_SRC = `${import.meta.env.BASE_URL}media/testimonial-guy-poster.webp`;

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
          {/* Captions: no VTT track yet — the transcribed pull-quote beside
              the video carries the gist for muted / deaf users until a Hebrew
              caption file is produced. */}
          {playing ? (
            <video
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full bg-black"
            />
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
            <p className="text-sm font-semibold text-foreground">גיא כהן</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              מוביל קהילה לעצמאים · המלצה בווידאו
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default VideoTestimonial;
