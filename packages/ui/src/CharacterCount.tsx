"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Character count (components/character-count.md) — the remaining-characters message below a
 * length-limited field, announced politely (aria-live="polite") so a screen reader hears it without
 * interruption. Over the limit it uses the error style but never truncates the value.
 */
const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toNe = (n: number) => String(Math.abs(n)).split("").map((d) => NE_DIGITS[Number(d)] ?? d).join("");

export function CharacterCount({ current, max, id }: { current: number; max: number; id?: string }): ReactNode {
  const { language } = useTheme();
  const remaining = max - current;
  const over = remaining < 0;
  const num = (n: number) => (language === "ne" ? toNe(n) : String(Math.abs(n)));

  const message = over
    ? language === "ne"
      ? `${num(remaining)} अक्षर बढी छ`
      : `${num(remaining)} characters too many`
    : language === "ne"
      ? `${num(remaining)} अक्षर बाँकी`
      : `You have ${num(remaining)} characters remaining`;

  return (
    <span id={id} className={cx("gov-character-count", over && "gov-character-count--over")} aria-live="polite">
      {message}
    </span>
  );
}
