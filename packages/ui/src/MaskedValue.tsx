"use client";

import { useState } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Masked value (components/masked-value.md) — a sensitive identifier masked by default, revealed
 * only by an explicit, permission-gated, audited action (§9.1). The reveal control is present only
 * when `canReveal` is true (the role check happens in the app), and `onReveal` records the audit
 * event. The masked state is announced as masked, not read digit by digit.
 */
interface MaskedValueProps {
  value: string;
  /** How many trailing characters to show, e.g. 4 → ••••2345. */
  visibleChars?: number;
  /** Whether the current user's role permits revealing (§9.1). */
  canReveal?: boolean;
  /** Called when revealed — record the audit event (who/when). */
  onReveal?: () => void;
  /** What is revealed, for the control's accessible name, e.g. "citizenship number". */
  name: string;
  className?: string;
}

export function MaskedValue({ value, visibleChars = 4, canReveal = false, onReveal, name, className }: MaskedValueProps) {
  const { language } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const masked = "••••" + value.slice(-visibleChars);
  const show = language === "ne" ? `${name} देखाउनुहोस्` : `Show ${name}`;
  const hide = language === "ne" ? `${name} लुकाउनुहोस्` : `Hide ${name}`;

  return (
    <span className={cx("gov-masked", className)}>
      <span aria-label={revealed ? undefined : `${name}, masked`}>{revealed ? value : masked}</span>
      {canReveal && (
        <button
          type="button"
          className="gov-icon-button"
          aria-label={revealed ? hide : show}
          aria-pressed={revealed}
          onClick={() => {
            if (!revealed) onReveal?.();
            setRevealed((r) => !r);
          }}
        >
          <span aria-hidden="true">{revealed ? "🙈" : "👁"}</span>
        </button>
      )}
    </span>
  );
}
