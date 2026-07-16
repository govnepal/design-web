"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";
import { Button } from "./Button.js";

/**
 * Feedback widget (components/feedback-widget.md) — the lightweight "was this page useful?" prompt
 * plus a route to report a problem (guidelines/10-governance/03-governance.md). One-tap, never
 * inserted mid-task, never a blocking modal, never bundled with analytics consent (§2.1, §9.1.2).
 */
interface FeedbackWidgetProps {
  onRespond: (useful: boolean) => void;
  reportHref: string;
  className?: string;
}

export function FeedbackWidget({ onRespond, reportHref, className }: FeedbackWidgetProps) {
  const { language } = useTheme();
  const [done, setDone] = useState(false);
  const q = language === "ne" ? "के यो पृष्ठ उपयोगी थियो?" : "Was this page useful?";
  const yes = language === "ne" ? "उपयोगी" : "Yes";
  const no = language === "ne" ? "उपयोगी छैन" : "No";
  const thanks = language === "ne" ? "धन्यवाद।" : "Thank you for your feedback.";
  const report = language === "ne" ? "यस पृष्ठको समस्या रिपोर्ट गर्नुहोस्" : "Report a problem with this page";

  return (
    <div className={cx("gov-feedback", className)}>
      {done ? (
        <span>{thanks}</span>
      ) : (
        <>
          <span>{q}</span>
          <Button variant="secondary" size="sm" type="button" onClick={() => { onRespond(true); setDone(true); }}>{yes}</Button>
          <Button variant="secondary" size="sm" type="button" onClick={() => { onRespond(false); setDone(true); }}>{no}</Button>
        </>
      )}
      <a className="gov-link" href={reportHref}>{report}</a>
    </div>
  );
}
