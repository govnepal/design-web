import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Breadcrumb (components/breadcrumb.md) — where a page sits in the site hierarchy, with links to
 * ancestors. Web/desktop only (a linear task flow uses the stepper + back link, §7.2). The current
 * page is the last crumb, marked aria-current and not a link; separators are decorative.
 */
export interface Crumb {
  label: ReactNode;
  href?: string;
}

export function Breadcrumb({ items, label = "Breadcrumb", className }: { items: Crumb[]; label?: string; className?: string }) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="gov-breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: "var(--gov-space-2)" }}>
              {i > 0 && (
                <span className="gov-breadcrumb__sep" aria-hidden="true">
                  ›
                </span>
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              ) : (
                <a className="gov-link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
