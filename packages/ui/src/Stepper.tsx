import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Stepper (components/stepper.md) — 3–7 named steps of a multi-step citizen application.
 *
 * An ordered list (not divs), `aria-current="step"` on the current item, completed steps are links
 * back where the flow allows (data preserved), upcoming steps are not focusable. On mobile it
 * collapses to "Step 2 of 5 / चरण २ मध्ये ५" with the current step name — never a cramped rail. The
 * stepper never owns navigation state; steps and the current index come from the flow.
 */

export interface Step {
  label: ReactNode;
  /** A link back to a completed step, where revisiting is allowed. Omit for the current/upcoming. */
  href?: string;
}

interface StepperProps {
  steps: Step[];
  /** Zero-based index of the current step. */
  current: number;
  className?: string;
}

/** Devanagari numerals for the Nepali condensed label (§3.1 numeral rules). */
const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toNepaliNumber = (n: number) => String(n).split("").map((d) => NE_DIGITS[Number(d)] ?? d).join("");

export function Stepper({ steps, current, className }: StepperProps) {
  const { language } = useTheme();
  const currentStep = steps[current];
  const num = (n: number) => (language === "ne" ? toNepaliNumber(n) : String(n));

  return (
    <div className={cx("gov-stepper-wrap", className)}>
      {/* Condensed, mobile — hidden on wide screens by CSS. */}
      <p className="gov-stepper__condensed">
        {language === "ne"
          ? `चरण ${num(current + 1)} मध्ये ${num(steps.length)}`
          : `Step ${num(current + 1)} of ${num(steps.length)}`}
        {currentStep ? ` — ${""}` : ""}
        {currentStep && <strong>{currentStep.label}</strong>}
      </p>

      <ol className="gov-stepper">
        {steps.map((step, i) => {
          const state = i < current ? "complete" : i === current ? "current" : "upcoming";
          return (
            <li
              className={cx("gov-stepper__step", state !== "upcoming" && `gov-stepper__step--${state}`)}
              key={i}
              aria-current={i === current ? "step" : undefined}
            >
              <span className="gov-stepper__marker" aria-hidden="true">
                {state === "complete" ? "✓" : num(i + 1)}
              </span>
              {/* Completed steps are links back; current and upcoming are plain text. */}
              {state === "complete" && step.href ? (
                <a className="gov-stepper__link" href={step.href}>
                  {step.label}
                </a>
              ) : (
                <span>{step.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
