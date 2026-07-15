"use client";

import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Loading state (components/loading-state.md) — content is on its way. Announced via role="status"
 * with an accessible name; the animation is the one sanctioned continuous loop (§5.5) and collapses
 * under reduced-motion (the status is still announced, so no information is lost). For a known-length
 * operation with a percentage, use ProgressBar instead.
 */
export function LoadingState({ label, className }: { label?: string; className?: string }) {
  const { language } = useTheme();
  const text = label ?? (language === "ne" ? "लोड हुँदै…" : "Loading…");
  return (
    <div className={cx("gov-loading", className)} role="status">
      <span className="gov-spinner" aria-hidden="true" />
      <span className="gov-visually-hidden">{text}</span>
    </div>
  );
}

/** A skeleton placeholder shaped like the incoming content (pulses no faster than slow, §5.5). */
export function Skeleton({ width, height = "1em", className }: { width?: string; height?: string; className?: string }) {
  return <span className={cx("gov-skeleton", className)} aria-hidden="true" style={{ display: "block", inlineSize: width, blockSize: height }} />;
}
