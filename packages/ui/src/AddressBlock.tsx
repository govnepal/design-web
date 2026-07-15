"use client";

import { Select, type SelectOption } from "./Select.js";
import { TextInput } from "./TextInput.js";
import { Stack } from "./layout.js";
import type { ReactNode } from "react";

/**
 * Address block (components/address-block.md) — a Nepal address as a cascading Province → District →
 * Local level → Ward → Tole group. Each select is filtered by its parent (official lists,
 * data/nepal-fields.yaml); changing a parent resets its children. Values are official codes, not
 * free text. The app supplies the option lists and handles the cascade filtering.
 */
export interface AddressValue {
  province?: string;
  district?: string;
  localLevel?: string;
  ward?: string;
  tole?: string;
}

interface AddressBlockProps {
  legend: ReactNode;
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  provinces: SelectOption[];
  /** Districts for the chosen province (app-filtered). */
  districts: SelectOption[];
  /** Local levels for the chosen district (app-filtered). */
  localLevels: SelectOption[];
}

export function AddressBlock({ legend, value, onChange, provinces, districts, localLevels }: AddressBlockProps) {
  const set = (patch: Partial<AddressValue>) => onChange({ ...value, ...patch });
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="gov-field__label" style={{ marginBlockEnd: "var(--gov-space-3)" }}>{legend}</legend>
      <Stack gap={4}>
        {/* Changing a parent resets its children so a stale district can't survive a province change. */}
        <Select label="Province" placeholder="Select your province" options={provinces} value={value.province ?? ""}
          onChange={(e) => set({ province: e.target.value, district: "", localLevel: "" })} />
        <Select label="District" placeholder="Select your district" options={districts} value={value.district ?? ""}
          disabled={!value.province} onChange={(e) => set({ district: e.target.value, localLevel: "" })} />
        <Select label="Municipality / Rural Municipality" placeholder="Select your local level" options={localLevels} value={value.localLevel ?? ""}
          disabled={!value.district} onChange={(e) => set({ localLevel: e.target.value })} />
        <TextInput label="Ward" widthChars={2} inputMode="numeric" value={value.ward ?? ""} onChange={(e) => set({ ward: e.target.value })} />
        <TextInput label="Tole / street" value={value.tole ?? ""} onChange={(e) => set({ tole: e.target.value })} />
      </Stack>
    </fieldset>
  );
}
