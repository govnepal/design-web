"use client";

import type { Language } from "./themeCore.js";
import { cx } from "./cx.js";
import { useTheme } from "./ThemeProvider.js";

/**
 * Language switcher (components/language-switcher.md) — a compact text toggle, each language shown
 * by its own autonym ("नेपाली", not "Nepali"), the current one distinguished by weight + underline
 * (never colour alone). Each option is a real link with `lang` set and `aria-current` on the
 * active one; switching updates the page's own lang so a screen reader changes pronunciation.
 *
 * The available languages are data-driven, so adding a third (Maithili, …) is a content change,
 * not a rebuild. Switching never triggers a reload that loses in-progress form state — with no
 * `hrefs` given it toggles in place via the theme provider.
 */

interface LanguageChoice {
  code: Language | string;
  /** The language's own name — its autonym. */
  autonym: string;
  href?: string;
}

interface LanguageSwitcherProps {
  /** Defaults to the v1 two-language set (Nepali, English). */
  languages?: LanguageChoice[];
  className?: string;
}

const DEFAULT_LANGUAGES: LanguageChoice[] = [
  { code: "ne", autonym: "नेपाली" },
  { code: "en", autonym: "English" },
];

export function LanguageSwitcher({ languages = DEFAULT_LANGUAGES, className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTheme();

  return (
    <div className={cx("gov-language-switcher", className)}>
      {languages.map((choice, i) => (
        <span key={choice.code} style={{ display: "contents" }}>
          {i > 0 && (
            <span className="gov-language-switcher__divider" aria-hidden="true">
              ·
            </span>
          )}
          <a
            href={choice.href ?? "#"}
            lang={choice.code}
            hrefLang={choice.code}
            aria-current={language === choice.code ? "true" : undefined}
            onClick={(event) => {
              if (!choice.href) event.preventDefault();
              // Only the two known app languages drive the provider; others rely on their href.
              if (choice.code === "ne" || choice.code === "en") setLanguage(choice.code);
            }}
          >
            {choice.autonym}
          </a>
        </span>
      ))}
    </div>
  );
}
