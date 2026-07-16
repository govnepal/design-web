import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Back link (components/back-link.md) — return to the previous step of a task flow without losing
 * data (§7.1). Renders above the page heading. It is an <a> when it maps to a URL; the browser Back
 * button must also keep working (§7.2) — this is the in-page mirror of it.
 */
const LABEL = { ne: "पछाडि", en: "Back" } as const;

interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export function BackLink({ children, className, ...rest }: BackLinkProps) {
  const { language } = useTheme();
  return (
    <a className={cx("gov-link", "gov-link--back", className)} {...rest}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6l-6 6 6 6" />
      </svg>
      {children ?? LABEL[language]}
    </a>
  );
}
