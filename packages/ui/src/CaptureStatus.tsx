import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Biometric capture status (components/biometric-capture-status.md and the fingerprint/face/iris
 * variants) — the live state of an officer-operated capture step. State is shown by icon + text +
 * colour, never colour alone (§4.1), announced politely as it changes. The raw biometric sample is
 * NEVER rendered here (§9.1) — only capture status and quality.
 *
 * One component covers the fingerprint / face / iris cases; the `kind` only affects the label.
 */
type CaptureState = "idle" | "capturing" | "pass" | "retry" | "error";

const ICON: Record<CaptureState, string> = { idle: "○", capturing: "…", pass: "✓", retry: "↻", error: "✕" };

interface CaptureStatusProps {
  state: CaptureState;
  /** Plain message, e.g. "Captured — good quality" or "Move slightly and try again". */
  message: ReactNode;
  className?: string;
}

export function CaptureStatus({ state, message, className }: CaptureStatusProps) {
  const tone = state === "pass" ? "pass" : state === "retry" ? "retry" : state === "error" ? "error" : "";
  return (
    <div className={cx("gov-capture-status", tone && `gov-capture-status--${tone}`, className)} role="status" aria-live="polite">
      <span className="gov-capture-status__icon" aria-hidden="true">{ICON[state]}</span>
      <span>{message}</span>
    </div>
  );
}

/** Face capture frame — the viewfinder guide (never renders the sample; §9.1). */
export function FaceCaptureFrame({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cx("gov-capture-frame", className)} role="img" aria-label="Face capture guide">
      {children ?? "Align the face within the frame"}
    </div>
  );
}
