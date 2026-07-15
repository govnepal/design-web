"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { Container } from "./layout.js";
import { Button } from "./Button.js";

/**
 * Cookie consent banner (components/cookie-banner.md) — opt-in consent for NON-essential cookies
 * only (§9.1.2). Reject is exactly as prominent as Accept — no dark patterns. Non-blocking: it does
 * not wall off public information, and the choice is revisitable from the footer (the app persists
 * it). Strictly necessary cookies never trigger this.
 */
interface CookieBannerProps {
  children: ReactNode;
  onAccept: () => void;
  onReject: () => void;
  acceptLabel?: ReactNode;
  rejectLabel?: ReactNode;
  className?: string;
}

export function CookieBanner({ children, onAccept, onReject, acceptLabel = "Accept analytics cookies", rejectLabel = "Reject", className }: CookieBannerProps) {
  return (
    <div className={cx("gov-cookie-banner", className)} role="region" aria-label="Cookie consent">
      <Container>
        <div className="gov-cookie-banner__inner">
          <div>{children}</div>
          {/* Equal weight: both are the same button treatment, one tap each (§9.1.2). */}
          <div className="gov-cookie-banner__actions">
            <Button variant="secondary" type="button" onClick={onReject}>{rejectLabel}</Button>
            <Button variant="secondary" type="button" onClick={onAccept}>{acceptLabel}</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
