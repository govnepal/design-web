import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Offline banner (components/offline-banner.md) — the connection is lost; state what still works and
 * how retry behaves (§8.1.2). Announced politely on appear; never colour alone — the sentence
 * carries the meaning (§4.1). Driven by real connectivity detection in the app; never a dead end.
 */
export function OfflineBanner({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("gov-offline-banner", className)} role="status" aria-live="polite">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
