"use client";

import type { ReactNode } from "react";
import { Modal } from "./Modal.js";
import { Button } from "./Button.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Confirmation dialog (components/confirmation-dialog.md) — an explicit, informed confirmation before
 * a high-risk or irreversible action (approve, reject, delete, submit, print, export — §9.1). Warning
 * text alone is not a sufficient safeguard.
 *
 * Layers on Modal: role="alertdialog", focus starts on the SAFER (cancel) control, a destructive
 * confirmation does not dismiss on scrim click, and the confirm button repeats the specific verb and
 * object ("Reject application"). Nothing inside animates (§5.5).
 */
interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: ReactNode;
  children: ReactNode;
  /** The confirm button label — the specific verb and object, e.g. "Reject application". */
  confirmLabel: ReactNode;
  cancelLabel?: ReactNode;
  destructive?: boolean;
}

export function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  title,
  children,
  confirmLabel,
  cancelLabel,
  destructive = false,
}: ConfirmationDialogProps) {
  const { language } = useTheme();
  const cancel = cancelLabel ?? (language === "ne" ? "रद्द गर्नुहोस्" : "Cancel");

  return (
    <Modal
      open={open}
      onClose={onCancel}
      role="alertdialog"
      title={title}
      // A destructive decision must be read: no silent scrim dismissal.
      dismissOnScrim={!destructive}
      actions={
        <>
          {/* Cancel is the safe default and comes first so focus (first focusable) lands here. */}
          <Button variant="secondary" type="button" onClick={onCancel}>
            {cancel}
          </Button>
          <Button variant={destructive ? "destructive" : "primary"} type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
