"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * File upload (components/file-upload.md) — upload a document with the accepted types and size limit
 * stated UP FRONT (before selection), via a real <input type="file"> with a bound label. Never a
 * drag-only drop zone (§4.1 — no drag-only interactions). Errors say what to do, never "Error 413"
 * (§3.1); the rest of the form is never lost on a failed upload (§7.1) — the app owns that.
 */
interface FileUploadProps {
  label: ReactNode;
  id?: string;
  /** e.g. ["jpg","png","pdf"] — stated before selection. */
  accept?: string[];
  maxMb?: number;
  error?: ReactNode;
  onSelect?: (file: File | null) => void;
}

export function FileUpload({ label, id, accept = ["jpg", "png", "pdf"], maxMb = 5, error, onSelect }: FileUploadProps) {
  const { language } = useTheme();
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const types = accept.map((t) => t.toUpperCase()).join(", ");
  const hint =
    language === "ne"
      ? `${maxMb} MB भन्दा सानो ${types} फाइल अपलोड गर्नुहोस्`
      : `Upload a ${types} smaller than ${maxMb} MB`;

  return (
    <div className={cx("gov-field", error ? "gov-field--error" : undefined)}>
      <label className="gov-field__label" htmlFor={fieldId}>{label}</label>
      <span className="gov-field__hint" id={hintId}>{hint}</span>
      <input
        id={fieldId}
        type="file"
        accept={accept.map((t) => `.${t}`).join(",")}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onSelect?.(e.target.files?.[0] ?? null)}
      />
      {error && <span className="gov-field__error" id={errorId}>{error}</span>}
    </div>
  );
}
