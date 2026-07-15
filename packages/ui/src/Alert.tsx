"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Alert (components/alert.md) — page-level status the user must read.
 *
 * The behavior this layer adds over the .gov-alert classes is the live-region contract, which is
 * easy to get subtly wrong:
 *   - an alert that appears DYNAMICALLY (a failed submit, a just-arrived outage notice) is
 *     announced, so `live` opts it into role="alert"/aria-live;
 *   - a STATIC alert already on the page at load is ordinary content and must NOT be a live
 *     region, or a screen reader re-announces it on every navigation;
 *   - the emergency variant is never given a close button here, because it is not dismissible by
 *     the citizen (§7.4) — only the authorized office removes it.
 */

type AlertVariant = "info" | "success" | "warning" | "error" | "emergency";

interface AlertProps {
  variant: AlertVariant;
  title: ReactNode;
  children?: ReactNode;
  /** Set when the alert appears dynamically, so assistive tech announces it. */
  live?: boolean;
  /** The status icon (icon.size.md). Decorative — title + colour + this together carry state. */
  icon?: ReactNode;
  className?: string;
}

export function Alert({ variant, title, children, live = false, icon, className }: AlertProps) {
  // error and emergency are assertive (interrupt); info/success/warning are polite. A static
  // alert gets no live role at all.
  const assertive = variant === "error" || variant === "emergency";
  const liveProps = live
    ? { role: "alert" as const, "aria-live": assertive ? ("assertive" as const) : ("polite" as const) }
    : {};

  return (
    <div className={cx("gov-alert", `gov-alert--${variant}`, className)} {...liveProps}>
      {icon && (
        <span className="gov-alert__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="gov-alert__body">
        <span className="gov-alert__title">{title}</span>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
