"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./Button.js";
import { ConfirmationDialog } from "./ConfirmationDialog.js";
import { Textarea } from "./Textarea.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Approval decision panel (components/approval-decision-panel.md) — the officer's approve / reject /
 * request-correction actions (§7.4). Each is a high-risk action (§9.1) confirmed via a dialog;
 * reject and request-correction require a reason. Reject (destructive, final) is distinct from
 * request-correction (resubmittable) in both copy and outcome (§3.1 glossary). The reason and
 * decision are recorded to the audit trail by the app.
 */
type Decision = "approve" | "correction" | "reject" | null;

interface ApprovalDecisionPanelProps {
  onApprove: () => void;
  onRequestCorrection: (reason: string) => void;
  onReject: (reason: string) => void;
}

export function ApprovalDecisionPanel({ onApprove, onRequestCorrection, onReject }: ApprovalDecisionPanelProps) {
  const { language } = useTheme();
  const [pending, setPending] = useState<Decision>(null);
  const [reason, setReason] = useState("");
  const t = (ne: string, en: string) => (language === "ne" ? ne : en);

  const close = () => { setPending(null); setReason(""); };

  return (
    <div className="gov-cluster">
      <Button type="button" onClick={onApprove}>{t("निवेदन स्वीकृत गर्नुहोस्", "Approve application")}</Button>
      <Button variant="secondary" type="button" onClick={() => setPending("correction")}>{t("सुधार अनुरोध गर्नुहोस्", "Request correction")}</Button>
      <Button variant="destructive" type="button" onClick={() => setPending("reject")}>{t("निवेदन अस्वीकृत गर्नुहोस्", "Reject application")}</Button>

      <ConfirmationDialog
        open={pending !== null}
        destructive={pending === "reject"}
        title={pending === "reject" ? t("निवेदन अस्वीकृत गर्ने?", "Reject this application?") : t("सुधार अनुरोध गर्ने?", "Request a correction?")}
        confirmLabel={pending === "reject" ? t("अस्वीकृत गर्नुहोस्", "Reject application") : t("सुधार अनुरोध गर्नुहोस्", "Request correction")}
        onCancel={close}
        onConfirm={() => {
          if (!reason.trim()) return; // A reason is required (§9.1).
          if (pending === "reject") onReject(reason);
          else onRequestCorrection(reason);
          close();
        }}
      >
        <Textarea
          label={t("कारण (नागरिकलाई देखाइनेछ)", "Reason (shown to the citizen)")}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={!reason.trim() ? t("कारण लेख्नुहोस्", "Enter a reason") : undefined}
        />
      </ConfirmationDialog>
    </div>
  );
}
