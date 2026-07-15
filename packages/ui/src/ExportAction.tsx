"use client";

import type { ReactNode } from "react";
import { Button } from "./Button.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Export action (components/export-action.md) — export the current data view to a file, stating the
 * format (and, in copy, the scope). Sensitive fields follow the same masking/authorization rules on
 * export (§9.1). Large exports should show progress (the app wires that).
 */
interface ExportActionProps {
  format: "CSV" | "PDF";
  onExport: () => void;
  exporting?: boolean;
  children?: ReactNode;
}

export function ExportAction({ format, onExport, exporting = false, children }: ExportActionProps) {
  const { language } = useTheme();
  const label = children ?? (language === "ne" ? `${format} मा निर्यात गर्नुहोस्` : `Export to ${format}`);
  const busy = language === "ne" ? "निर्यात हुँदै…" : "Exporting…";
  return (
    <Button variant="secondary" type="button" loading={exporting} loadingLabel={busy} onClick={onExport}>
      {label}
    </Button>
  );
}
