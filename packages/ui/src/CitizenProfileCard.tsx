import type { ReactNode } from "react";
import { Card } from "./Card.js";
import { SummaryList, type SummaryRow } from "./SummaryList.js";

/**
 * Citizen profile card (components/citizen-profile-card.md) — an officer's view of a citizen's key
 * details, name Nepali-first, sensitive identifiers masked by default (§9.1). Shows only the fields
 * the officer's task needs (data minimisation); caste/ethnicity never in default views (§7.1). The
 * app supplies rows whose sensitive values are already MaskedValue components.
 */
interface CitizenProfileCardProps {
  nameNe: string;
  nameEn?: string;
  /** Detail rows; sensitive values should be MaskedValue instances (§9.1). */
  rows: SummaryRow[];
  photo?: ReactNode;
  className?: string;
}

export function CitizenProfileCard({ nameNe, nameEn, rows, photo, className }: CitizenProfileCardProps) {
  return (
    <Card className={className}>
      <div style={{ display: "flex", gap: "var(--gov-space-4)", alignItems: "center" }}>
        {photo && <div style={{ flexShrink: 0 }}>{photo}</div>}
        <div>
          <h3 style={{ margin: 0 }} lang="ne">{nameNe}</h3>
          {nameEn && <p className="gov-text-secondary" style={{ margin: 0 }} lang="en">{nameEn}</p>}
        </div>
      </div>
      <SummaryList rows={rows} />
    </Card>
  );
}
