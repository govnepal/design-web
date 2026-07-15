"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * One-time-code input (components/otp-input.md) — enter a short SMS code. A single accessible field
 * with autocomplete="one-time-code" and inputmode="numeric" so the OS offers autofill and pasting
 * the whole code fills it. The resend control is disabled with a countdown; never allow instant
 * infinite resend. A non-SMS fallback path is the app's responsibility (§8.1.6, citizens abroad).
 */
interface OtpInputProps {
  label: ReactNode;
  id?: string;
  length?: number;
  error?: ReactNode;
  value?: string;
  onChange?: (code: string) => void;
  /** Seconds until resend is allowed; the control is disabled until 0. */
  resendIn?: number;
  onResend?: () => void;
}

export function OtpInput({ label, id, length = 6, error, value, onChange, resendIn = 0, onResend }: OtpInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        className="gov-input gov-input--masked"
        style={{ inlineSize: `${length + 4}ch` }}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={(e) => onChange?.(e.target.value.replace(/[^\d]/g, "").slice(0, length))}
      />
      <button type="button" className="gov-link" disabled={resendIn > 0} onClick={onResend} style={{ background: "none", border: 0, padding: 0, cursor: resendIn > 0 ? "not-allowed" : "pointer" }}>
        Resend code{resendIn > 0 ? ` (available in ${resendIn}s)` : ""}
      </button>
      {error && <span className="gov-field__error" id={errorId}>{error}</span>}
    </div>
  );
}
