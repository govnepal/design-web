"use client";

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "./cx.js";

/**
 * Select (components/select.md) — one choice from a known list (province, district, document type).
 *
 * A native <select>, deliberately: it inherits the OS picker on mobile, which beats any custom
 * dropdown on a small screen and works with every assistive technology. The first option is a real
 * instruction ("Select your province"), disabled and never a value.
 *
 * The behavior over the .gov-select classes: the label binding, aria-describedby joining hint and
 * error, aria-invalid on error, and a stable id the error summary can target — the same form-field
 * contract as TextInput.
 */

export interface SelectOption {
  value: string;
  label: ReactNode;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: ReactNode;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** The disabled leading instruction, e.g. "Select your province". Shown when nothing is chosen. */
  placeholder?: string;
  options: SelectOption[];
}

export function Select({
  label,
  id,
  hint,
  error,
  placeholder,
  options,
  className,
  defaultValue,
  value,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={selectId}>
        {label}
      </label>
      {hint && (
        <span className="gov-field__hint" id={hintId}>
          {hint}
        </span>
      )}
      <select
        id={selectId}
        className={cx("gov-select", className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        defaultValue={value === undefined && defaultValue === undefined && placeholder ? "" : defaultValue}
        value={value}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
