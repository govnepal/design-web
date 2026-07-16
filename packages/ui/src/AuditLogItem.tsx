import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Audit log item (components/audit-log-item.md) — one immutable audit-trail entry: who did what,
 * when (NPT, labelled), from where, and why (§9.1). Reads as a coherent sentence to a screen reader;
 * no interactive edit controls (audit entries are records, never edited).
 */
interface AuditLogItemProps {
  actor: ReactNode;
  action: ReactNode;
  /** Already formatted in NPT with the timezone label. */
  timestamp: ReactNode;
  reason?: ReactNode;
  reference?: string;
  className?: string;
}

export function AuditLogItem({ actor, action, timestamp, reason, reference, className }: AuditLogItemProps) {
  return (
    <li className={cx("gov-audit-item", className)}>
      <div>
        <strong>{actor}</strong> {action}
        {reference && <> · <span className="gov-audit-item__ref">{reference}</span></>}
      </div>
      <div className="gov-audit-item__meta">
        {timestamp}
        {reason && <> — {reason}</>}
      </div>
    </li>
  );
}
