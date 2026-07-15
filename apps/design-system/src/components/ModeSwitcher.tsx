"use client";

import { ThemeProvider, useTheme, type ColorMode } from "@nepal-gov/ui";

/**
 * The whole-page display-mode switcher for the site header (distinct from the per-example mode
 * PANEL, which previews a subtree). This one drives the ROOT provider, so changing it restyles the
 * entire site — the docs site eating its own dog food: a visitor can read the whole thing in dark,
 * high-contrast, or colour-blind-safe mode, which is also the honest way to show that every page
 * really does hold up in every mode.
 *
 * It is a small island. The rest of each page is static HTML that simply inherits whatever mode
 * this sets on <html>.
 */

const MODES: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "high-contrast", label: "High contrast" },
  { id: "color-blind-safe", label: "Colour-blind-safe" },
];

function Control() {
  const { resolvedColorMode, largeText, setColorMode, setLargeText } = useTheme();

  return (
    <div className="gov-cluster" role="group" aria-label="Display settings">
      <label className="gov-field__label gov-text-small" htmlFor="site-mode">
        Mode
      </label>
      <select
        id="site-mode"
        className="gov-input"
        style={{ inlineSize: "auto", minBlockSize: "auto", paddingBlock: "var(--gov-space-2)" }}
        value={resolvedColorMode}
        onChange={(e) => setColorMode(e.target.value as ColorMode)}
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      <label className="gov-cluster gov-text-small" style={{ gap: "var(--gov-space-2)" }}>
        <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
        Large text
      </label>
    </div>
  );
}

export function ModeSwitcher() {
  // A root provider (not nested): it applies to <html>, so the whole page follows.
  return (
    <ThemeProvider>
      <Control />
    </ThemeProvider>
  );
}
