"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Modal (components/modal.md) — focus the user on one short self-contained task without leaving the
 * page. The whole value is the focus contract, which is easy to ship wrong:
 *   - on open, focus moves into the dialog;
 *   - while open, focus is TRAPPED inside it (Tab cycles within);
 *   - on close, focus returns to the element that opened it;
 *   - Escape closes a plain modal; the background is inert (aria-hidden handled by the app root).
 *
 * role="dialog" + aria-modal + an accessible name from the title. A destructive confirmation uses
 * ConfirmationDialog, which layers alertdialog semantics on top of this.
 */
const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** The action row (buttons). */
  actions?: ReactNode;
  /** alertdialog for a decision that must be read (ConfirmationDialog sets this). */
  role?: "dialog" | "alertdialog";
  /** A destructive confirmation does not dismiss on scrim click or (optionally) Escape. */
  dismissOnScrim?: boolean;
  dismissOnEscape?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  role = "dialog",
  dismissOnScrim = true,
  dismissOnEscape = true,
  className,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // Remember what to return focus to, then move focus into the dialog.
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      // Trap focus within the dialog.
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const firstEl = focusable[0]!;
      const lastEl = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Restore focus to the trigger on close.
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose, dismissOnEscape]);

  if (!open) return null;

  return (
    <div
      className="gov-modal__scrim"
      onClick={(e) => {
        if (dismissOnScrim && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx("gov-modal", className)}
      >
        <h2 className="gov-modal__title" id={titleId}>
          {title}
        </h2>
        <div>{children}</div>
        {actions && <div className="gov-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
