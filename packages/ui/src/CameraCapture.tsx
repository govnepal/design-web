"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Camera capture (components/camera-capture.md) — capture a document/portrait photo on a device, with
 * quality guidance and a preview before accepting (§8.1.2). This component frames the capture flow
 * and ALWAYS offers a file-upload fallback (no dead ends, §4.1); the actual getUserMedia handling is
 * wired by the app (device/permission specifics vary), which passes the live view and controls in.
 */
interface CameraCaptureProps {
  /** Plain framing guidance, e.g. "Fit the whole certificate in the frame". */
  guidance: ReactNode;
  /** The live viewfinder node from the app (a <video>), or a captured preview. */
  view: ReactNode;
  onCapture: () => void;
  /** The file-upload fallback, always present. */
  fallback: ReactNode;
  captureLabel?: ReactNode;
  className?: string;
}

export function CameraCapture({ guidance, view, onCapture, fallback, captureLabel = "Take photo", className }: CameraCaptureProps) {
  return (
    <div className={cx("gov-camera-capture", className)}>
      <p className="gov-text-secondary">{guidance}</p>
      <div className="gov-capture-frame">{view}</div>
      <div className="gov-cluster" style={{ marginBlockStart: "var(--gov-space-3)" }}>
        <button type="button" className="gov-button gov-button--primary" onClick={onCapture}>{captureLabel}</button>
      </div>
      {/* Always an alternative — never a capture-only dead end (§8.1.2). */}
      <div style={{ marginBlockStart: "var(--gov-space-4)" }}>{fallback}</div>
    </div>
  );
}
