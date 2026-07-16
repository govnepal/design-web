"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Button (components/button.md) — for actions that change state (submit, save, approve). If it
 * only takes the user somewhere, it is a Link, not a Button.
 *
 * The behavior this layer adds over the .gov-button classes:
 *   - a real <button> always (never a styled div), so Enter and Space both activate for free;
 *   - the loading contract: aria-busy, a label that stays put, and repeat activation ignored
 *     while busy, rather than the control vanishing from the tab order;
 *   - disabled via aria-disabled, keeping the control focusable so "why is this disabled" can be
 *     discovered — an invisible disabled control is a support-call generator (the spec's words).
 */

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel,
  disabled = false,
  icon,
  className,
  children,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  const inert = disabled || loading;
  return (
    <button
      // type defaults to "button": an un-typed button inside a form submits it, which is a
      // classic accidental-submit bug. A submit button opts in explicitly with type="submit".
      type={type}
      className={cx("gov-button", `gov-button--${variant}`, size !== "md" && `gov-button--${size}`, className)}
      // aria-disabled, not the `disabled` attribute: the control stays focusable so a screen
      // reader can reach it and announce why it is unavailable (components/button.md).
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        // Repeat activation is ignored while busy or disabled — without removing the control.
        if (inert) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <>
          <span className="gov-button__spinner" aria-hidden="true" />
          {/* The label remains ("Submitting…"), never replaced by a bare spinner. */}
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        <>
          {icon && (
            <span className="gov-button__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
