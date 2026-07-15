import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Warning text (components/warning-text.md) — a single fact that changes the consequence of a
 * nearby action ("This cannot be undone", "Fees are non-refundable after submission"). Inline icon
 * + short sentence, no card or fill (that is alert). It is NOT a sufficient safeguard for a
 * destructive action on its own — that needs a confirmation dialog (§9.1); this only warns.
 *
 * The sentence carries the meaning; the icon and colour reinforce it (rules/status-not-color-alone).
 */

interface WarningTextProps {
  children: ReactNode;
  /** Set when the warning appears dynamically in response to input — then it announces politely. */
  live?: boolean;
  className?: string;
}

export function WarningText({ children, live = false, className }: WarningTextProps) {
  return (
    <p className={cx("gov-warning-text", className)} {...(live ? { "aria-live": "polite" } : {})}>
      <svg className="gov-warning-text__icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 2L1 21h22L12 2zm0 6l7 12H5l7-12zm-1 3v4h2v-4h-2zm0 5v2h2v-2h-2z" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
