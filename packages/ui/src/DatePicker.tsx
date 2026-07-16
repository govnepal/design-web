"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Date picker (components/date-picker.md) — accessible day/month/year fields, preferred over a custom
 * calendar grid on citizen forms (more robust with assistive tech and low-end devices). BS leads in
 * the Nepali UI, AD in English; conversion is never silent (§3.1). The `calendar` label is stated,
 * not assumed. The machine value stays ISO/AD; this is the entry surface.
 */
export interface DateParts {
  day?: string;
  month?: string;
  year?: string;
}

interface DatePickerProps {
  legend: ReactNode;
  /** Which calendar these fields are entered in — shown to the citizen, never assumed. */
  calendar?: "BS" | "AD";
  value: DateParts;
  onChange: (parts: DateParts) => void;
  error?: ReactNode;
}

export function DatePicker({ legend, calendar, value, onChange, error }: DatePickerProps) {
  const { language } = useTheme();
  const base = useId();
  const cal = calendar ?? (language === "ne" ? "BS" : "AD");
  const errorId = error ? `${base}-error` : undefined;
  const set = (patch: Partial<DateParts>) => onChange({ ...value, ...patch });
  const L = { day: language === "ne" ? "दिन" : "Day", month: language === "ne" ? "महिना" : "Month", year: language === "ne" ? "वर्ष" : "Year" };

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={errorId}>
      <legend className="gov-field__label">{legend} ({cal})</legend>
      <div className="gov-cluster" style={{ marginBlockStart: "var(--gov-space-2)" }}>
        <label>{L.day}<input className="gov-input gov-input--width-2" inputMode="numeric" maxLength={2} value={value.day ?? ""} onChange={(e) => set({ day: e.target.value.replace(/\D/g, "") })} aria-invalid={error ? true : undefined} /></label>
        <label>{L.month}<input className="gov-input gov-input--width-2" inputMode="numeric" maxLength={2} value={value.month ?? ""} onChange={(e) => set({ month: e.target.value.replace(/\D/g, "") })} aria-invalid={error ? true : undefined} /></label>
        <label>{L.year}<input className="gov-input gov-input--width-4" inputMode="numeric" maxLength={4} value={value.year ?? ""} onChange={(e) => set({ year: e.target.value.replace(/\D/g, "") })} aria-invalid={error ? true : undefined} /></label>
      </div>
      {error && <span className="gov-field__error" id={errorId}>{error}</span>}
    </fieldset>
  );
}
