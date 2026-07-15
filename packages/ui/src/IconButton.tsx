import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Icon button (components/icon-button.md) — an icon-only action. The `label` is REQUIRED and becomes
 * the accessible name: an icon button with no accessible name is unusable by a screen reader. Never
 * a primary action (§5.4). The 44x44 hit area holds even though the icon is smaller.
 */
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** The action, e.g. "Close" — becomes the accessible name and (via title) the tooltip. */
  label: string;
  icon: ReactNode;
  variant?: "default" | "ghost";
}

export function IconButton({ label, icon, variant = "default", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx("gov-icon-button", variant !== "default" && `gov-icon-button--${variant}`, className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className="gov-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
