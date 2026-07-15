import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Text input (components/text-input.md) — one question per row (§7.1).
 *
 * Almost the entire value of this component is the accessibility wiring, which is fiddly and
 * therefore the thing most often shipped wrong:
 *   - a visible <label for> bound to the input (never a placeholder acting as the label);
 *   - helper text and error text joined into aria-describedby in the right order;
 *   - aria-invalid on error, with the error message announced;
 *   - the value is NEVER cleared on error (§7.1) — this component is controlled/uncontrolled by
 *     the caller and never resets it;
 *   - a STABLE id, because the error summary links to it (components/error-summary.md).
 *
 * A width HINT (widthChars) is offered because a full-width box for a 2-digit ward number tells
 * the citizen the wrong thing about what to type (components/text-input.md's Anatomy).
 */

// `prefix` and `suffix` are native input attributes (deprecated, string-typed); we intend the
// affix slots, so they are omitted from the base and redeclared as ReactNode below.
interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "prefix" | "suffix"> {
  /** The question itself, in sentence case ("Citizenship number"). Always visible, always present. */
  label: ReactNode;
  /** Stable id — the error summary links to it. Auto-generated if omitted, but pass one for forms. */
  id?: string;
  /** Format example for hard fields ("e.g. 12-01-76-12345"). Bound via aria-describedby. */
  hint?: ReactNode;
  /** The error message. Specific and actionable ("Enter your mobile number"), never "Invalid". */
  error?: ReactNode;
  /** Width hint in characters — the input sizes to the content, not the container. */
  widthChars?: 2 | 4 | 10 | 20;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function TextInput({
  label,
  id,
  hint,
  error,
  widthChars,
  prefix,
  suffix,
  className,
  ...rest
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  // Order matters: the hint is announced before the error, matching reading order.
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  const widthClass = widthChars ? `gov-input--width-${widthChars}` : undefined;
  const input = (
    <input
      id={inputId}
      className={cx("gov-input", widthClass, !prefix && !suffix && className)}
      aria-describedby={describedBy}
      // A truthy aria-invalid only on error; absent otherwise (not "false", which some AT read out).
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  );

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={inputId}>
        {label}
      </label>
      {hint && (
        <span className="gov-field__hint" id={hintId}>
          {hint}
        </span>
      )}
      {prefix || suffix ? (
        <span className={cx("gov-input-group", className)}>
          {prefix && <span className="gov-input-group__affix">{prefix}</span>}
          {input}
          {suffix && <span className="gov-input-group__affix">{suffix}</span>}
        </span>
      ) : (
        input
      )}
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
