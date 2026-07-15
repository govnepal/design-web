import type { ReactNode } from "react";
import { Alert } from "./Alert.js";

/**
 * Duplicate match warning (components/duplicate-match-warning.md) — during NID enrolment, a possible
 * duplicate was found. It routes to HUMAN adjudication, never an auto-reject (a false match must not
 * silently deny a citizen their identity). Announced assertively; compared identifiers are masked
 * (§9.1). Non-accusatory language — a possible match is not proof.
 */
interface DuplicateMatchWarningProps {
  title?: ReactNode;
  children: ReactNode;
  /** The adjudication actions (confirm same / not a match / escalate). */
  actions?: ReactNode;
}

export function DuplicateMatchWarning({ title, children, actions }: DuplicateMatchWarningProps) {
  return (
    <div>
      <Alert variant="warning" title={title ?? "A possible duplicate record was found"} live>
        {children}
      </Alert>
      {actions && <div className="gov-cluster" style={{ marginBlockStart: "var(--gov-space-3)" }}>{actions}</div>}
    </div>
  );
}
