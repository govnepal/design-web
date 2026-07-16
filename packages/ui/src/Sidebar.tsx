import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Sidebar (components/sidebar.md) — an officer desktop's persistent left navigation rail. The
 * current view is aria-current and marked by more than colour; part of the three-panel layout.
 */
export interface SidebarLink {
  label: ReactNode;
  href: string;
  current?: boolean;
}

export function Sidebar({ links, label = "Sections", className }: { links: SidebarLink[]; label?: string; className?: string }) {
  return (
    <nav aria-label={label} className={cx("gov-sidebar", className)}>
      {links.map((link, i) => (
        <a key={i} href={link.href} className="gov-sidebar__link" aria-current={link.current ? "page" : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
