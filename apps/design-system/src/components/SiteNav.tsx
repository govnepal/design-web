"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitcher } from "./ModeSwitcher";

/**
 * The docs-site's own chrome — NOT the government Header component (that is for real services). A
 * plain nav plus the whole-page mode switcher island. It is a client component only so the active
 * link can be highlighted from the current path; the mode switcher inside it is the interactive
 * part that actually needs hydration.
 */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
];

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="site-nav">
      <div className="gov-container">
        <div className="site-nav__inner">
          <Link className="site-nav__brand" href="/">
            Civic&nbsp;Calm
          </Link>
          <nav className="site-nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <ModeSwitcher />
        </div>
      </div>
    </div>
  );
}
