"use client";

import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";
import { STATUS_TAXONOMY, type StatusId } from "./generated/statusTaxonomy.js";
import type { ReactNode } from "react";

/**
 * Application status tracker (components/application-status-tracker.md) — where a citizen's
 * application is in the official status sequence (§7.4), rendered from the taxonomy. The current
 * status is aria-current and stated in words; a status that requires action shows a next-step link
 * beside it — a warning without a way to act is a dead end (§7.3.2).
 */
interface TrackerProps {
  /** The taxonomy statuses this service moves through, in order. */
  sequence: StatusId[];
  current: StatusId;
  /** A next-step action, shown beside the current status when it requires action. */
  action?: ReactNode;
  className?: string;
}

export function ApplicationStatusTracker({ sequence, current, action, className }: TrackerProps) {
  const { language } = useTheme();
  const currentIndex = sequence.indexOf(current);

  return (
    <ol className={cx("gov-status-tracker", className)}>
      {sequence.map((id, i) => {
        const entry = STATUS_TAXONOMY[id];
        const label = language === "ne" ? entry.label_ne : entry.label;
        const state = i < currentIndex ? "complete" : i === currentIndex ? "current" : "upcoming";
        return (
          <li
            key={id}
            className={cx("gov-status-tracker__step", state !== "upcoming" && `gov-status-tracker__step--${state}`)}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="gov-status-tracker__marker" aria-hidden="true">{state === "complete" ? "✓" : ""}</span>
            <span>
              {label}
              {state === "current" && entry.requiresAction && action && (
                <span style={{ display: "block", marginBlockStart: "var(--gov-space-2)" }}>{action}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
