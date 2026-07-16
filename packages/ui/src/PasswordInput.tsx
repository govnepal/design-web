"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Password input (components/password-input.md) — a password field with a show/hide toggle and NO
 * paste-blocking (blocking paste breaks password managers and harms security, §4.1). The toggle is a
 * real button whose accessible name reflects state (aria-pressed). Requirements are described up
 * front via aria-describedby, never sprung as a post-submit gotcha.
 */
interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  label: ReactNode;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** current-password (sign-in) or new-password (create account) for manager integration. */
  autoComplete?: "current-password" | "new-password";
}

export function PasswordInput({ label, id, hint, error, autoComplete = "current-password", className, ...rest }: PasswordInputProps) {
  const { language } = useTheme();
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const [shown, setShown] = useState(false);
  const show = language === "ne" ? "पासवर्ड देखाउनुहोस्" : "Show password";
  const hide = language === "ne" ? "पासवर्ड लुकाउनुहोस्" : "Hide password";

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={fieldId}>{label}</label>
      {hint && <span className="gov-field__hint" id={hintId}>{hint}</span>}
      <span className="gov-password">
        <input
          id={fieldId}
          type={shown ? "text" : "password"}
          className={cx("gov-input", className)}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <button type="button" className="gov-password__toggle" aria-pressed={shown} aria-label={shown ? hide : show} onClick={() => setShown((s) => !s)}>
          {shown ? (language === "ne" ? "लुकाउनुहोस्" : "Hide") : (language === "ne" ? "देखाउनुहोस्" : "Show")}
        </button>
      </span>
      {error && (
        <span className="gov-field__error" id={errorId}>
          <svg className="gov-field__error-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" /></svg>
          {error}
        </span>
      )}
    </div>
  );
}
