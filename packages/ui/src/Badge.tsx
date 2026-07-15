import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";
import { STATUS_TAXONOMY, type StatusId } from "./generated/statusTaxonomy.js";

/**
 * Status badge (components/badge.md) — renders one status from the official taxonomy (§7.3.2) and
 * nothing else. There is no free-text badge: an ad-hoc status is not a styling problem, it means
 * the taxonomy needs extending first. So this takes a `status` id, not a label and colour — the
 * label, the bilingual text, and the colour variant all come from the generated taxonomy, which
 * is generated from the guidelines. A status not in the taxonomy is a TypeScript error.
 *
 * The badge carries text + icon + colour, never colour alone (§4.1). It is never interactive —
 * filtering happens in the filter bar — so it is a <span>, not a button.
 */

interface BadgeProps {
  status: StatusId;
  /** An optional status icon (icon.size.sm). Decorative — the label already carries the meaning. */
  icon?: ReactNode;
  className?: string;
}

export function Badge({ status, icon, className }: BadgeProps) {
  const { language } = useTheme();
  const entry = STATUS_TAXONOMY[status];
  const label = language === "ne" ? entry.label_ne : entry.label;

  return (
    <span className={cx("gov-badge", `gov-badge--${entry.badge}`, className)}>
      {icon && (
        <span className="gov-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </span>
  );
}

/** Re-exported so an officer worklist can drive its own logic from the same taxonomy. */
export { STATUS_TAXONOMY, type StatusId };
