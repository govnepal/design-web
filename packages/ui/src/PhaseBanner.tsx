import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Phase banner (components/phase-banner.md) — a single-line band directly below the government
 * header on a service still in pilot. Plain text, never colour alone; reads in document order
 * right after the header landmark, before the main content. Remove it (don't leave "new" stale)
 * once the service reaches official status — so it's driven by the service's status, not hardcoded.
 */

interface PhaseBannerProps {
  /** The phase word — "New" / "Pilot". */
  phase: ReactNode;
  /** One clause on what that means, plus a feedback link, e.g. "help us improve it. Give feedback". */
  children: ReactNode;
  className?: string;
}

export function PhaseBanner({ phase, children, className }: PhaseBannerProps) {
  return (
    <div className={cx("gov-phase-banner", className)}>
      <div className="gov-container">
        <span className="gov-phase-banner__tag">{phase}</span>
        <span>{children}</span>
      </div>
    </div>
  );
}
