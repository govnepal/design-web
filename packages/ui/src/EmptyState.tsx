import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Empty state (components/empty-state.md) — explain why a list/results area is empty and what to do
 * next. Never shown during loading (that is LoadingState); never a bare "No data". Distinguish
 * no-data (nothing exists yet) from no-results (a filter excluded everything) via the message/action.
 */
export function EmptyState({ title, children, action, className }: { title: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("gov-empty-state", className)}>
      <p className="gov-empty-state__title">{title}</p>
      {children && <p>{children}</p>}
      {action && <div className="gov-empty-state__action">{action}</div>}
    </div>
  );
}
