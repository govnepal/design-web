import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Bottom navigation (components/bottom-navigation.md) — the citizen mobile app's primary nav, fixed
 * at the bottom. 3–5 destinations, each an icon PLUS a label (never icon-only, §5.4); the current
 * one marked aria-current and by more than colour.
 */
export interface BottomNavItem {
  label: ReactNode;
  href: string;
  icon: ReactNode;
  current?: boolean;
}

export function BottomNavigation({ items, label = "Primary", className }: { items: BottomNavItem[]; label?: string; className?: string }) {
  return (
    <nav aria-label={label} className={cx("gov-bottom-nav", className)}>
      {items.map((item, i) => (
        <a key={i} href={item.href} className="gov-bottom-nav__item" aria-current={item.current ? "page" : undefined}>
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
