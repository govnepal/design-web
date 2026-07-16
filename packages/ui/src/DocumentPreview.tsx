import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Document preview (components/document-preview.md) — a bounded preview of an uploaded/generated
 * document so the user can confirm it before proceeding (§8.1.2). The image alt describes what it is
 * ("Preview of uploaded citizenship certificate"), never "image"; controls are labelled buttons.
 */
interface DocumentPreviewProps {
  src: string;
  /** Describes the document, used as the alt text — never "image". */
  alt: string;
  fileName?: string;
  fileSize?: string;
  actions?: ReactNode;
  className?: string;
}

export function DocumentPreview({ src, alt, fileName, fileSize, actions, className }: DocumentPreviewProps) {
  return (
    <div className={cx("gov-doc-preview", className)}>
      <img src={src} alt={alt} style={{ maxInlineSize: "100%", maxBlockSize: "16rem", border: "var(--gov-border-width-sm) solid var(--gov-color-border-default)", borderRadius: "var(--gov-radius-md)" }} />
      {(fileName || fileSize) && (
        <p className="gov-text-secondary gov-text-small">
          {fileName}{fileName && fileSize ? " · " : ""}{fileSize}
        </p>
      )}
      {actions && <div className="gov-cluster">{actions}</div>}
    </div>
  );
}
