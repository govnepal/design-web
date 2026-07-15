"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Link (components/link.md) — for navigation. Anything that changes state is a Button.
 *
 * The behavior this layer adds over the .gov-link classes is the accessible-name half of the
 * visual markers: an external link's ↗ and a download link's ↓ are decorative (aria-hidden in
 * CSS), so the fact that the link leaves .gov.np, or points at a file, must be carried in text a
 * screen reader can read. This component appends that text, bilingually, so a developer cannot
 * ship the visual marker without its accessible counterpart — the exact gap §9.2 and §4.1 warn
 * about.
 */

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "external" | "download" | "back";
  /** Standalone links (not inline in a paragraph) take the 44px min hit area (components/link.md). */
  standalone?: boolean;
  children: ReactNode;
}

const EXTERNAL_NOTE = { ne: "(बाह्य साइट)", en: "(external site)" } as const;

export function Link({ variant = "default", standalone = false, className, children, href, ...rest }: LinkProps) {
  const { language } = useTheme();

  const isExternal = variant === "external";
  const isDownload = variant === "download";

  return (
    <a
      href={href}
      className={cx(
        "gov-link",
        variant !== "default" && `gov-link--${variant}`,
        standalone && "gov-link--standalone",
        className,
      )}
      // An external link is not opened in a new tab by default; when a consumer sets target,
      // rel is hardened. rel is set unconditionally for external links even in the same tab, so
      // the opener reference and referrer never leak to a non-.gov.np destination.
      {...(isExternal ? { rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {/* The ↗ / ↓ glyphs are added by CSS and hidden from assistive tech; this is their spoken
          equivalent, so the marker never exists without an accessible name behind it. */}
      {isExternal && <span className="gov-visually-hidden"> {EXTERNAL_NOTE[language]}</span>}
      {isDownload && rest["aria-label"] === undefined && (
        // A download link should state format and size in its own text ("Form (PDF, 240 KB)");
        // this is only a fallback marker, not a substitute for that content.
        <span className="gov-visually-hidden"> {language === "ne" ? "(डाउनलोड)" : "(download)"}</span>
      )}
    </a>
  );
}
