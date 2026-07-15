"use client";

import { useId, type FormHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Search box (components/search-box.md) — a labelled query field in a role="search" landmark. The
 * label is real (a placeholder is not a label, §7.1); submitting is a real form submit so Enter
 * works. The clear control (when present) is a labelled icon button.
 */
interface SearchBoxProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  label: ReactNode;
  name?: string;
  defaultValue?: string;
  onSubmit?: (query: string) => void;
  buttonLabel?: ReactNode;
}

export function SearchBox({ label, name = "q", defaultValue, onSubmit, buttonLabel, className, ...rest }: SearchBoxProps) {
  const { language } = useTheme();
  const fieldId = useId();
  const submit = buttonLabel ?? (language === "ne" ? "खोज्नुहोस्" : "Search");

  return (
    <form
      role="search"
      className={cx("gov-search-field", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get(name);
        onSubmit?.(typeof value === "string" ? value : "");
      }}
      {...rest}
    >
      <label className="gov-field__label" htmlFor={fieldId}>{label}</label>
      <span className="gov-search">
        <input id={fieldId} name={name} type="search" className="gov-input" defaultValue={defaultValue} />
        <button type="submit" className="gov-button gov-button--primary">{submit}</button>
      </span>
    </form>
  );
}
