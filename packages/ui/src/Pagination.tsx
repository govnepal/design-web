"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Pagination (components/pagination.md) — move through a long list one page at a time, with the
 * position visible ("Page X of Y"). nav[aria-label=Pagination]; the current page is aria-current;
 * Previous/Next are disabled at the ends. Numerals follow the active language (§3.1).
 */
const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toNe = (n: number) => String(n).split("").map((d) => NE_DIGITS[Number(d)] ?? d).join("");

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Build the href for a page; omit for a button-driven handler via onNavigate. */
  hrefFor?: (page: number) => string;
  onNavigate?: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, hrefFor, onNavigate, className }: PaginationProps) {
  const { language } = useTheme();
  const num = (n: number) => (language === "ne" ? toNe(n) : String(n));
  const prevLabel = language === "ne" ? "अघिल्लो" : "Previous";
  const nextLabel = language === "ne" ? "अर्को" : "Next";
  const position =
    language === "ne" ? `पृष्ठ ${num(page)} / ${num(totalPages)}` : `Page ${num(page)} of ${num(totalPages)}`;

  const control = (target: number, label: string, disabled: boolean): ReactNode => {
    if (disabled) {
      return (
        <span className="gov-pagination__link" aria-disabled="true">
          {label}
        </span>
      );
    }
    return hrefFor ? (
      <a className="gov-pagination__link" href={hrefFor(target)} aria-label={label}>
        {label}
      </a>
    ) : (
      <button type="button" className="gov-pagination__link" onClick={() => onNavigate?.(target)} aria-label={label}>
        {label}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="gov-pagination">
        <li>{control(page - 1, prevLabel, page <= 1)}</li>
        <li aria-current="page" style={{ padding: "0 var(--gov-space-3)" }}>
          {position}
        </li>
        <li>{control(page + 1, nextLabel, page >= totalPages)}</li>
      </ul>
    </nav>
  );
}
