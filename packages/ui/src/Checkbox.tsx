"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Checkbox (components/checkbox.md) — an independent yes/no choice, or one of several from a short
 * list. A legal declaration ("I confirm the information is correct") is the canonical single use,
 * and it is NEVER pre-ticked: an unticked declaration is the legal point.
 *
 * The behavior over the .gov-choice classes: a real <input type="checkbox"> (never a styled div),
 * the whole label clickable and bound with htmlFor, and the checked state surviving a validation
 * error — this component never resets it.
 */

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  hint?: ReactNode;
}

export function Checkbox({ label, hint, id, className, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <label className={cx("gov-choice", className)} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        className="gov-choice__input"
        aria-describedby={hintId}
        {...rest}
      />
      <span className="gov-choice__label">
        {label}
        {hint && (
          <span className="gov-choice__hint" id={hintId}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
