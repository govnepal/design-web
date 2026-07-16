"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Progress bar (components/progress-bar.md) — determinate progress with a text percentage for a
 * known-length operation (an upload). role="progressbar" with the aria-value attributes; the number
 * is shown as text as well as the bar (never conveyed by the bar alone, §4.1). Forward-only fill.
 */
const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toNe = (n: number) => String(n).split("").map((d) => NE_DIGITS[Number(d)] ?? d).join("");

export function ProgressBar({ value, max = 100, label, className }: { value: number; max?: number; label: ReactNode; className?: string }): ReactNode {
  const { language } = useTheme();
  const pct = Math.round((value / max) * 100);
  const pctText = language === "ne" ? `${toNe(pct)}%` : `${pct}%`;
  return (
    <div className={cx("gov-progress", className)}>
      <div
        className="gov-progress__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={typeof label === "string" ? label : undefined}
      >
        <div className="gov-progress__fill" style={{ inlineSize: `${pct}%` }} />
      </div>
      <span className="gov-progress__label">
        {label} — {pctText}
      </span>
    </div>
  );
}
