import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { Stack } from "./layout.js";

/**
 * Officer review panel (components/officer-review-panel.md) — the officer's working surface for a
 * review (§7.4): the application's details, its documents, its history, and the decision actions,
 * with clear landmark/heading structure so a screen-reader user can move between them. A composition
 * shell; the sections are the profile card, document previews, status/audit, and the decision panel
 * supplied by the app.
 */
interface OfficerReviewPanelProps {
  details: ReactNode;
  documents?: ReactNode;
  history?: ReactNode;
  decision: ReactNode;
  className?: string;
}

export function OfficerReviewPanel({ details, documents, history, decision, className }: OfficerReviewPanelProps) {
  return (
    <div className={cx("gov-review-panel", className)}>
      <Stack gap={8}>
        <section aria-label="Applicant details">{details}</section>
        {documents && <section aria-label="Documents">{documents}</section>}
        {history && <section aria-label="History">{history}</section>}
        <section aria-label="Decision">{decision}</section>
      </Stack>
    </div>
  );
}
