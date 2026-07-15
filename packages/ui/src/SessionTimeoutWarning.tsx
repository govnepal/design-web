"use client";

import type { ReactNode } from "react";
import { Modal } from "./Modal.js";
import { Button } from "./Button.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Session timeout warning (components/session-timeout-warning.md) — warn before an idle session ends,
 * letting the user stay signed in without losing entered data (§9.1). Built on Modal as an
 * alertdialog so it is announced; focus lands on "Stay signed in". The countdown is passed in and
 * should be announced on a coarse interval by the app, not every second (which floods a screen
 * reader). Entered data survives re-authentication (the app owns persistence).
 */
interface SessionTimeoutWarningProps {
  open: boolean;
  /** Seconds remaining, shown in the message. */
  secondsLeft: number;
  onStay: () => void;
  onSignOut: () => void;
}

export function SessionTimeoutWarning({ open, secondsLeft, onStay, onSignOut }: SessionTimeoutWarningProps) {
  const { language } = useTheme();
  const minutes = Math.ceil(secondsLeft / 60);
  const message =
    language === "ne"
      ? `तपाईंको सत्र लगभग ${minutes} मिनेटमा सकिन्छ। साइन इन रहनुहुन्छ?`
      : `Your session will end in about ${minutes} minute${minutes === 1 ? "" : "s"}. Stay signed in?`;
  const stay = language === "ne" ? "साइन इन रहनुहोस्" : "Stay signed in";
  const out = language === "ne" ? "अहिले साइन आउट गर्नुहोस्" : "Sign out now";
  const title = language === "ne" ? "सत्र सकिन लाग्यो" : "Your session is about to end";

  return (
    <Modal
      open={open}
      onClose={onStay}
      role="alertdialog"
      title={title}
      dismissOnScrim={false}
      actions={
        <>
          {/* Focus lands on the first focusable — "Stay signed in", the safe action. */}
          <Button type="button" onClick={onStay}>{stay}</Button>
          <Button variant="secondary" type="button" onClick={onSignOut}>{out}</Button>
        </>
      }
    >
      {message}
    </Modal>
  );
}
