import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Summary list (components/summary-list.md) — the "check your answers" rows before submit: each the
 * question, the citizen's answer, and a "Change" link back to the step that set it (§7.4). Rendered
 * as a description list so the question/answer relationship is announced; each change link names
 * what it changes, never a bare repeated "Change".
 */
export interface SummaryRow {
  key: ReactNode;
  value: ReactNode;
  /** The change link. Its accessible name should include what it changes. */
  action?: ReactNode;
}

export function SummaryList({ rows, className }: { rows: SummaryRow[]; className?: string }) {
  return (
    <dl className={cx("gov-summary-list", className)}>
      {rows.map((row, i) => (
        <div className="gov-summary-list__row" key={i}>
          <dt className="gov-summary-list__key">{row.key}</dt>
          <dd className="gov-summary-list__value">{row.value}</dd>
          {row.action && <dd className="gov-summary-list__action">{row.action}</dd>}
        </div>
      ))}
    </dl>
  );
}
