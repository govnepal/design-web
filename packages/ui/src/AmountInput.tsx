"use client";

import { TextInput } from "./TextInput.js";
import type { ReactNode } from "react";

/**
 * Amount input (components/amount-input.md) — a currency field with the रु prefix. Built on
 * TextInput's prefixed variant. Grouping (१,५०,०००, lakh/crore) is presentation applied by the app
 * on the displayed value; the submitted machine value stays Arabic digits ungrouped (§3.1). The रु
 * prefix is context, never a value the citizen types or deletes.
 */
interface AmountInputProps {
  label: ReactNode;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  value?: string;
  onChange?: (raw: string) => void;
}

export function AmountInput({ label, id, hint, error, value, onChange }: AmountInputProps) {
  return (
    <TextInput
      id={id}
      label={label}
      hint={hint}
      error={error}
      prefix="रु"
      inputMode="numeric"
      widthChars={10}
      value={value}
      onChange={(e) => onChange?.(e.target.value.replace(/[^\d]/g, ""))}
    />
  );
}
