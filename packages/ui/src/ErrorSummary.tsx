import { useEffect, useId, useRef } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Error summary (components/error-summary.md) — after a failed submit, every problem in one box
 * at the top, each linked to its field. Mandatory on every form alongside inline errors (§7.1).
 *
 * Two behaviors are the whole reason this is a component and not a styled list:
 *   1. On appearance it takes focus (tabindex=-1 + focus()), so a keyboard or screen-reader user
 *      is put at the summary the instant the submit fails, not left wherever they were.
 *   2. Each entry does not merely SCROLL to its field — it moves FOCUS into it. A plain #anchor
 *      scrolls the field into view but often leaves focus behind, so a keyboard user arrives
 *      next to the field and has to hunt for it. This intercepts the click and focuses the target.
 *
 * The entries are built from the SAME validation result that renders the inline errors — one
 * source, two renderings, so the summary and the field can never disagree (§7.1). The caller
 * passes that shared result in; this component does not re-derive errors.
 */

export interface FieldError {
  /** The id of the input this error belongs to — the link target. */
  fieldId: string;
  /** The message, identical to the inline error text ("Enter your mobile number"). */
  message: string;
}

interface ErrorSummaryProps {
  errors: FieldError[];
  /** Move focus here when the summary appears. On by default — a summary appears only on failure. */
  focusOnAppear?: boolean;
  className?: string;
}

const HEADING = { ne: "समस्या छ", en: "There is a problem" } as const;

export function ErrorSummary({ errors, focusOnAppear = true, className }: ErrorSummaryProps) {
  const { language } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (focusOnAppear && errors.length > 0) ref.current?.focus();
    // Re-focus whenever the set of errors changes — a second failed submit is a new event the
    // user needs taking back to the top.
  }, [focusOnAppear, errors]);

  if (errors.length === 0) return null;

  const focusField = (fieldId: string) => (event: React.MouseEvent) => {
    const field = document.getElementById(fieldId);
    if (!field) return; // Fall back to the native #anchor jump.
    event.preventDefault();
    field.focus();
    // Focus alone is what matters for accessibility; scrolling is a nicety. Guard it because not
    // every environment implements it (jsdom, some embedded webviews).
    field.scrollIntoView?.({ block: "center", behavior: "auto" });
  };

  return (
    <div
      ref={ref}
      className={cx("gov-error-summary", className)}
      // role="alert" announces it on appearance; tabindex=-1 makes it programmatically focusable
      // without adding it to the normal tab order.
      role="alert"
      tabIndex={-1}
      aria-labelledby={titleId}
    >
      <h2 className="gov-error-summary__title" id={titleId}>
        {HEADING[language]}
        {/* The count is available to assistive tech but not shown twice visually. */}
        <span className="gov-visually-hidden">
          {" "}
          ({errors.length})
        </span>
      </h2>
      <ul className="gov-error-summary__list">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a
              className="gov-error-summary__link"
              href={`#${error.fieldId}`}
              onClick={focusField(error.fieldId)}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
