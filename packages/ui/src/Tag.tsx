import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Tag (components/tag.md) — a neutral, non-status categorical label. It deliberately never uses a
 * status colour (that is the Badge's job, drawn from the status taxonomy) so the two are never
 * confused. Not interactive.
 */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("gov-tag", className)}>{children}</span>;
}
