type FounderMarkProps = {
  /**
   * To replace this typographic mark with a real photo:
   *   1. Drop a square photo at public/founder.jpg (or .webp).
   *   2. Pass photoSrc="/founder.jpg" to this component.
   *   3. The photo will be rendered as a circular portrait at the same scale.
   */
  photoSrc?: string;
  size?: "sm" | "md";
};

const FounderMark = ({ photoSrc, size = "md" }: FounderMarkProps) => {
  const dim = size === "sm" ? "h-12 w-12" : "h-16 w-16";

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt="ארז טל-שיר"
        className={`${dim} shrink-0 rounded-full object-cover ring-1 ring-border`}
        loading="eager"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${dim} shrink-0 select-none rounded-full bg-foreground/[0.04] ring-1 ring-border flex items-center justify-center`}
    >
      <span className="font-semibold text-foreground/80 text-lg tracking-tight">
        א.ט
      </span>
    </div>
  );
};

export default FounderMark;
