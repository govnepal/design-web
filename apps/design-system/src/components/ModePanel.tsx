"use client";

import { useState, type ReactNode } from "react";
import { ThemeProvider, type ColorMode, type Language } from "@nepal-gov/ui";

/**
 * The mode-preview panel (apps/design-system/README): render a live example in any display mode —
 * light / dark / high-contrast / color-blind-safe, composed with large-text and reduced-motion —
 * and in either language, without leaving the page. It is powered by a NESTED ThemeProvider (§10.2
 * permits a nested provider to override the display mode for a subtree), and it doubles as the
 * accessibility review tool: a reviewer walks a component through all six modes in seconds.
 *
 * This is a React island. It is the interactive part of an otherwise static page, so only it and
 * its children hydrate — the surrounding documentation ships as zero-JS HTML.
 */

const COLOR_MODES: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "high-contrast", label: "High contrast" },
  { id: "color-blind-safe", label: "Colour-blind-safe" },
];

interface ModePanelProps {
  children: ReactNode;
}

export function ModePanel({ children }: ModePanelProps) {
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className="site-example">
      <div
        className="gov-cluster"
        style={{ marginBlockEnd: "var(--gov-space-4)", justifyContent: "space-between" }}
        role="group"
        aria-label="Preview controls"
      >
        <div className="gov-cluster">
          <label className="gov-field__label" htmlFor="mode-select">
            Mode
          </label>
          <select
            id="mode-select"
            className="gov-input"
            style={{ inlineSize: "auto" }}
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
          >
            {COLOR_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="gov-cluster">
          <label className="gov-cluster" style={{ gap: "var(--gov-space-2)" }}>
            <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
            Large text
          </label>
          <label className="gov-cluster" style={{ gap: "var(--gov-space-2)" }}>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
            Reduced motion
          </label>
          <button
            type="button"
            className="gov-button gov-button--secondary gov-button--sm"
            onClick={() => setLanguage((l) => (l === "en" ? "ne" : "en"))}
            aria-label="Toggle preview language"
          >
            {language === "en" ? "नेपाली" : "EN"}
          </button>
        </div>
      </div>

      {/* The nested provider applies the chosen mode to THIS subtree only, via its wrapper element
          — the surrounding page keeps whatever mode the visitor set in the site header. */}
      <ThemeProvider
        nested
        colorMode={colorMode}
        largeText={largeText}
        reducedMotion={reducedMotion}
        language={language}
      >
        <div
          style={{
            padding: "var(--gov-space-6)",
            background: "var(--gov-color-background-default)",
            borderRadius: "var(--gov-radius-sm)",
          }}
        >
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
