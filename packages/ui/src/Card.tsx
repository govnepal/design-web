import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Card (components/card.md) — group everything about one subject into one opaque surface. The
 * `interactive` variant makes the WHOLE card a single link; never nest independent links inside a
 * clickable card (a nested-interactive failure), so interactive cards render an <a> and expect
 * their content to be non-interactive.
 */
interface CardProps extends HTMLAttributes<HTMLElement> {
  interactive?: boolean;
  href?: string;
  as?: ElementType;
  children: ReactNode;
}

export function Card({ interactive = false, href, as, className, children, ...rest }: CardProps) {
  const Tag: ElementType = interactive ? "a" : (as ?? "div");
  return (
    <Tag
      className={cx("gov-card", interactive && "gov-card--interactive", className)}
      {...(interactive ? { href } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}
