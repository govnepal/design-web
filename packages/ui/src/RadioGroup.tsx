"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Radio group (components/radio.md) — choose exactly one of 2–7 visible options.
 *
 * Gender is the canonical case: the three legal options (महिला / पुरुष / अन्य) are ALWAYS a radio
 * group, never a select that hides them (§7.1). And when the choice carries legal or personal
 * weight (gender, calendar), there is no default selection — the citizen must choose actively, so
 * this component does not preselect.
 *
 * The behavior over the .gov-choice classes: native radios sharing one `name` (so arrow keys move
 * within the group and Tab moves past it), a <fieldset>/<legend> carrying the question, and the
 * error marking the GROUP, not one option.
 */

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
}

interface RadioGroupProps {
  /** The question, rendered as the fieldset legend. */
  legend: ReactNode;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: ReactNode;
  className?: string;
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onChange,
  error,
  className,
}: RadioGroupProps) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <fieldset
      className={cx("gov-choice-group", error ? "gov-choice-group--error" : undefined, className)}
      aria-describedby={errorId}
      aria-invalid={error ? true : undefined}
    >
      <legend className="gov-choice-group__legend">{legend}</legend>
      {error && (
        <span className="gov-choice-group__error" id={errorId}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" />
          </svg>
          {error}
        </span>
      )}
      {options.map((option) => {
        const optionId = `${groupId}-${option.value}`;
        const hintId = option.hint ? `${optionId}-hint` : undefined;
        return (
          <label className="gov-choice" htmlFor={optionId} key={option.value}>
            <input
              id={optionId}
              type="radio"
              className="gov-choice__input"
              name={name}
              value={option.value}
              checked={value !== undefined ? value === option.value : undefined}
              defaultChecked={defaultValue !== undefined ? defaultValue === option.value : undefined}
              aria-describedby={hintId}
              onChange={(e) => onChange?.(e.target.value)}
            />
            <span className="gov-choice__label">
              {option.label}
              {option.hint && (
                <span className="gov-choice__hint" id={hintId}>
                  {option.hint}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
