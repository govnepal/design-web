"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Filter bar (components/filter-bar.md) — narrow a list/table by facets, with applied filters shown
 * as removable tags so the current view is always clear. Each applied tag's remove control is a
 * labelled icon-button ("Remove filter: …"); the updated result count is announced politely; the
 * empty case uses empty-state's no-results with a "Clear filters" action. The app supplies the
 * filter controls; this frames them plus the applied-tags row and count.
 */
export interface AppliedFilter {
  id: string;
  label: ReactNode;
  /** For the remove control's accessible name, e.g. "Under review". */
  value: string;
}

interface FilterBarProps {
  /** The filter controls (selects, date pickers). */
  children: ReactNode;
  applied: AppliedFilter[];
  onRemove: (id: string) => void;
  onClear: () => void;
  resultCount?: number;
  className?: string;
}

export function FilterBar({ children, applied, onRemove, onClear, resultCount, className }: FilterBarProps) {
  const { language } = useTheme();
  const clear = language === "ne" ? "फिल्टर हटाउनुहोस्" : "Clear filters";
  const removeLabel = (v: string) => (language === "ne" ? `फिल्टर हटाउनुहोस्: ${v}` : `Remove filter: ${v}`);

  return (
    <div className={cx("gov-filter-bar", className)} style={{ display: "flex", flexDirection: "column", gap: "var(--gov-space-3)", padding: "var(--gov-space-4)", background: "var(--gov-color-background-secondary)", borderRadius: "var(--gov-radius-md)" }}>
      <div className="gov-cluster">{children}</div>
      {applied.length > 0 && (
        <div className="gov-cluster">
          {applied.map((f) => (
            <span key={f.id} className="gov-tag">
              {f.label}
              <button type="button" className="gov-icon-button" style={{ minInlineSize: "auto", minBlockSize: "auto", padding: 0 }} aria-label={removeLabel(f.value)} onClick={() => onRemove(f.id)}>
                <span aria-hidden="true">✕</span>
              </button>
            </span>
          ))}
          <button type="button" className="gov-link" style={{ background: "none", border: 0, cursor: "pointer" }} onClick={onClear}>{clear}</button>
        </div>
      )}
      {resultCount !== undefined && (
        <p className="gov-text-secondary gov-text-small" aria-live="polite">
          {language === "ne" ? `${resultCount} नतिजा` : `${resultCount} results`}
        </p>
      )}
    </div>
  );
}
