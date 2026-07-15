"use client";

import { useId, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Textarea (components/textarea.md) — multi-line free text. Same accessibility contract as
 * TextInput: bound label, aria-describedby joining hint then error, aria-invalid on error, a stable
 * id, and the value NEVER cleared on error (§7.1). Devanagari input is never blocked (§5.3).
 */
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: ReactNode;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
}

export function Textarea({ label, id, hint, error, className, ...rest }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={fieldId}>
        {label}
      </label>
      {hint && (
        <span className="gov-field__hint" id={hintId}>
          {hint}
        </span>
      )}
      <textarea
        id={fieldId}
        className={cx("gov-textarea", className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && (
        <span className="gov-field__error" id={errorId}>
          <svg className="gov-field__error-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
