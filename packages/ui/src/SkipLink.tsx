import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider.js";

/**
 * Skip link (components/skip-link.md) — the first focusable element on the page, jumping keyboard
 * users past the header to the main content. Visually hidden until focused (never display:none,
 * which would drop it from the tab order). The Header renders one automatically; this standalone
 * export is for pages that compose their own chrome.
 */
const LABEL = { ne: "मुख्य सामग्रीमा जानुहोस्", en: "Skip to main content" } as const;

export function SkipLink({ targetId = "main", children }: { targetId?: string; children?: ReactNode }) {
  const { language } = useTheme();
  return (
    <a className="gov-skip-link" href={`#${targetId}`}>
      {children ?? LABEL[language]}
    </a>
  );
}
