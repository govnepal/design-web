import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Table (components/table.md) — semantic rows/columns for comparison. A real <table> with
 * <th scope> so each cell's row/column is announced; never a grid of divs. Numeric columns are
 * right-aligned. On mobile, prefer cards when a table becomes unreadable (§7.3) — that is the
 * consumer's layout choice, not something this component forces.
 */
export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  numeric?: boolean;
}

export function Table<T>({ caption, columns, rows, sticky, getRowKey, className }: {
  caption?: ReactNode;
  columns: Column<T>[];
  rows: T[];
  sticky?: boolean;
  getRowKey: (row: T, index: number) => string | number;
  className?: string;
}) {
  return (
    <table className={cx("gov-table", sticky && "gov-table--sticky", className)}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className={col.numeric ? "gov-table__num" : undefined}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={getRowKey(row, i)}>
            {columns.map((col) => (
              <td key={col.key} className={col.numeric ? "gov-table__num" : undefined}>
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
