"use client";

import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { useTheme, type Language } from "./ThemeProvider.js";
import { Emblem } from "./Emblem.js";

/**
 * Government header (components/header.md, identity/government-header) — on every page of every
 * service, structurally identical everywhere. There is no per-ministry variant: consistency is
 * the citizen's primary cue that a site is genuinely governmental (§9.2), so the only inputs are
 * the office lockup and the service name.
 *
 * The emblem is a REQUIRED asset, taken as a prop. This component never draws it — recreating,
 * recolouring, or tracing the coat of arms is prohibited (identity/emblem), and no verified
 * master exists in design-assets yet. When `emblem` is omitted, it renders an explicit, ugly
 * dev-only placeholder rather than inventing artwork that might look shippable.
 */

interface HeaderProps {
  /**
   * The emblem. Defaults to the verified `<Emblem>` (served from the web root or @govnepal/css).
   * Pass a custom node only to point at a different asset path; pass `null` to opt out entirely.
   */
  emblem?: ReactNode;
  /** Where the emblem master is served from, if not the default web-root path. */
  emblemSrc?: string;
  /** Office name, Nepali first then English (Article 7). Both are shown; en hides on mobile. */
  officeNe: string;
  officeEn: string;
  /** The citizen-facing service name, not an internal system name. */
  serviceName?: ReactNode;
  /** Where the language switcher points for each language. Defaults to no-op anchors. */
  languageHrefs?: Record<Language, string>;
  /** The skip-link target id — the header renders the skip link as the first focusable element. */
  skipTargetId?: string;
  children?: ReactNode;
  className?: string;
}

const SKIP_LABEL = { ne: "मुख्य सामग्रीमा जानुहोस्", en: "Skip to main content" } as const;
const EMBLEM_ALT = { ne: "नेपाल सरकारको निशान छाप", en: "Emblem of the Government of Nepal" } as const;

export function Header({
  emblem,
  emblemSrc,
  officeNe,
  officeEn,
  serviceName,
  languageHrefs,
  skipTargetId = "main",
  children,
  className,
}: HeaderProps) {
  const { language, setLanguage } = useTheme();

  // Default to the verified emblem; `emblem={null}` opts out. The alt names the institution in the
  // active language (identity/emblem — never "logo").
  const emblemNode =
    emblem === undefined ? <Emblem src={emblemSrc} alt={EMBLEM_ALT[language]} /> : emblem;

  return (
    <header className={cx("gov-header", className)} role="banner">
      {/* The skip link is the first focusable element on the page (§7.2, §4.1). */}
      <a className="gov-skip-link" href={`#${skipTargetId}`}>
        {SKIP_LABEL[language]}
      </a>
      <div className="gov-container">
        <div className="gov-header__inner">
          <span className="gov-header__lockup">
            {emblemNode && <span className="gov-header__emblem">{emblemNode}</span>}
            <span className="gov-header__office">
              <span className="gov-header__office-ne" lang="ne">
                {officeNe}
              </span>
              <span className="gov-header__office-en" lang="en">
                {officeEn}
              </span>
            </span>
          </span>

          {serviceName && <span className="gov-header__service">{serviceName}</span>}

          {/* Language switcher: TEXT, never flags (identity/government-header). Switching preserves
              the user's place and form data — it only changes the language, never navigates. */}
          <nav className="gov-header__language" aria-label={language === "ne" ? "भाषा" : "Language"}>
            <a
              href={languageHrefs?.ne ?? "#"}
              lang="ne"
              hrefLang="ne"
              aria-current={language === "ne" ? "true" : undefined}
              onClick={(event) => {
                if (!languageHrefs) event.preventDefault();
                setLanguage("ne");
              }}
            >
              नेपाली
            </a>
            <span aria-hidden="true">/</span>
            <a
              href={languageHrefs?.en ?? "#"}
              lang="en"
              hrefLang="en"
              aria-current={language === "en" ? "true" : undefined}
              onClick={(event) => {
                if (!languageHrefs) event.preventDefault();
                setLanguage("en");
              }}
            >
              EN
            </a>
          </nav>

          {children}
        </div>
      </div>
    </header>
  );
}
