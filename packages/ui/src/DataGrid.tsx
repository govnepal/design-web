"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Data grid (components/data-grid.md) — a dense, sortable officer table built on real table
 * semantics. Sortable headers are buttons exposing aria-sort; never a div grid. Nepali text columns
 * sort by Devanagari collation via a comparator the app can supply (§7.3). This adds sort to the
 * table's semantics; row selection and sticky headers are opt-in via props/CSS.
 */
export interface GridColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  numeric?: boolean;
  /** Return a comparable value for sorting; omit to make the column unsortable. */
  sortValue?: (row: T) => string | number;
}

export function DataGrid<T>({ caption, columns, rows, getRowKey, locale = "en", className }: {
  caption?: ReactNode;
  columns: GridColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string | number;
  /** "ne" sorts Nepali columns with Devanagari collation (§7.3). */
  locale?: string;
  className?: string;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sorted = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const collator = new Intl.Collator(locale === "ne" ? "ne-NP" : "en");
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : collator.compare(String(av), String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  })();

  const toggleSort = (key: string) =>
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <table className={cx("gov-table", className)}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col) => {
            const ariaSort = sort?.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : col.sortValue ? "none" : undefined;
            return (
              <th key={col.key} scope="col" aria-sort={ariaSort} className={col.numeric ? "gov-table__num" : undefined}>
                {col.sortValue ? (
                  <button type="button" className="gov-icon-button" style={{ minBlockSize: "auto", padding: 0, background: "none", font: "inherit", fontWeight: "inherit" }} onClick={() => toggleSort(col.key)}>
                    {col.header} {sort?.key === col.key ? (sort.dir === "asc" ? "▲" : "▼") : "⇅"}
                  </button>
                ) : col.header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => (
          <tr key={getRowKey(row, i)}>
            {columns.map((col) => (
              <td key={col.key} className={col.numeric ? "gov-table__num" : undefined}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
