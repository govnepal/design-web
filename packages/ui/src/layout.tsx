import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx, type SpaceStep } from "./cx.js";

/**
 * The layout primitives (components/container.md, stack.md, page-section.md) — "the grid made
 * installable", the only sanctioned way to set page width, vertical rhythm, and page bands, so
 * spacing never appears hardcoded in product code. They add behavior only in one respect: the
 * `as` prop, so a stack of form fields can be a <fieldset> and a page section can be a <section>
 * with a heading — the semantics the spec requires, which pure CSS classes cannot supply.
 */

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "narrow" | "full-bleed";
  as?: ElementType;
  children: ReactNode;
}

export function Container({ variant = "default", as: As = "div", className, children, ...rest }: ContainerProps) {
  return (
    <As
      className={cx("gov-container", variant !== "default" && `gov-container--${variant}`, className)}
      {...rest}
    >
      {children}
    </As>
  );
}

interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Spacing token step only — an arbitrary pixel gap is a checker violation (components/stack.md). */
  gap?: SpaceStep;
  as?: ElementType;
  children: ReactNode;
}

export function Stack({ gap = 4, as: As = "div", className, children, ...rest }: StackProps) {
  return (
    <As className={cx("gov-stack", `gov-stack--${gap}`, className)} {...rest}>
      {children}
    </As>
  );
}

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary-background" | "inverse";
  /**
   * A page section becomes a labelled landmark region only when it has an accessible name;
   * otherwise it is presentation-only (components/page-section.md). Passing `aria-label` (or a
   * heading via `labelledBy`) is what upgrades it to <section role="region">.
   */
  labelledBy?: string;
  children: ReactNode;
}

export function PageSection({
  variant = "default",
  labelledBy,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: PageSectionProps) {
  const className_ = cx(
    "gov-page-section",
    variant !== "default" && `gov-page-section--${variant}`,
    className,
  );

  // A named band is a landmark region; an unnamed one is a plain div. A <section> with no
  // accessible name is not exposed as a landmark anyway, so rendering a div when unnamed is
  // both honest and avoids a meaningless generic region in the accessibility tree.
  if (labelledBy || ariaLabel) {
    return (
      <section className={className_} aria-labelledby={labelledBy} aria-label={ariaLabel} {...rest}>
        {children}
      </section>
    );
  }
  return (
    <div className={className_} {...rest}>
      {children}
    </div>
  );
}
