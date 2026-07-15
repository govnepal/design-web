import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Details (components/details.md) — optional explanatory content ("Why we ask this") that would add
 * length without necessity for most readers. Uses native <details>/<summary>, so the disclosure
 * semantics, keyboard operation, and screen-reader announcement come from the platform, never a
 * hand-rolled onClick div. Not a Server/Client distinction issue — no hooks — so it stays a plain
 * (server-capable) component.
 *
 * The label states what is inside, never a bare "More".
 */

interface DetailsProps {
  /** What the panel contains, e.g. "Why we ask for your ward number". Never "More info". */
  summary: ReactNode;
  children: ReactNode;
  /** Collapsed by default; a documented exception may open it. */
  defaultOpen?: boolean;
  className?: string;
}

export function Details({ summary, children, defaultOpen = false, className }: DetailsProps) {
  return (
    <details className={cx("gov-details", className)} open={defaultOpen || undefined}>
      <summary className="gov-details__summary">
        <svg
          className="gov-details__chevron"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        {summary}
      </summary>
      <div className="gov-details__content">{children}</div>
    </details>
  );
}
