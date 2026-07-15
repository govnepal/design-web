"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Toggle switch (components/toggle.md) — a single on/off setting with IMMEDIATE effect (no separate
 * save). A declaration or a form-submitted choice is a Checkbox, never a toggle (§7.1). The state is
 * conveyed by more than colour — position plus an on/off word — never colour alone (§4.1). Renders
 * role="switch" with aria-checked so the state is announced.
 */
interface ToggleProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** On/off words shown beside the switch so state isn't carried by colour/position alone. */
  stateLabels?: { on: string; off: string };
  disabled?: boolean;
  className?: string;
}

export function Toggle({ label, checked, onChange, stateLabels, disabled, className }: ToggleProps) {
  const labelId = useId();
  return (
    <span className={cx("gov-toggle-field", className)} style={{ display: "inline-flex", alignItems: "center", gap: "var(--gov-space-3)" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        className="gov-toggle"
        onClick={() => onChange(!checked)}
      >
        <span className="gov-toggle__track" aria-hidden="true">
          <span className="gov-toggle__handle" />
        </span>
      </button>
      <span id={labelId}>
        {label}
        {stateLabels && (
          <span className="gov-text-secondary gov-text-small"> — {checked ? stateLabels.on : stateLabels.off}</span>
        )}
      </span>
    </span>
  );
}
