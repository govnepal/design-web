/**
 * Server-safe theme utilities — no React, no hooks, no "use client".
 *
 * Split out from ThemeProvider so a React Server Component (e.g. a Next.js root layout) can import
 * `themeInitScript` to inline in <head>, and `applyTheme` if it needs it, without pulling the
 * client-only provider across the server/client boundary. The provider itself lives in
 * ThemeProvider.tsx and re-exports these.
 */

/** The four color modes (§5.2). large-text and reduced-motion are separate, composable flags. */
export type ColorMode = "light" | "dark" | "high-contrast" | "color-blind-safe";
export type Language = "ne" | "en";
export type Calendar = "BS" | "AD";
/** Matches data/density-rules.yaml ids. */
export type Density = "citizen-website" | "citizen-mobile-app" | "officer-desktop-app" | "kiosk-counter";

export interface ThemeState {
  /** Undefined means "follow the OS" — the default until the user chooses explicitly (§10.2). */
  colorMode: ColorMode | undefined;
  largeText: boolean;
  reducedMotion: boolean;
  language: Language;
  calendar: Calendar;
  density: Density;
}

export const THEME_STORAGE_KEY = "gov-theme";

export const THEME_DEFAULTS: ThemeState = {
  colorMode: undefined,
  largeText: false,
  reducedMotion: false,
  language: "ne", // Nepali-first (Article 7) — the default language of official business.
  calendar: "BS", // Bikram Sambat is the administrative calendar of record (§3.1).
  density: "citizen-website",
};

/** Read persisted choices. Device storage is the fallback; a signed-in app passes them via props. */
export function loadPersistedTheme(): Partial<ThemeState> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ThemeState>) : {};
  } catch {
    return {};
  }
}

/**
 * Apply the theme to a root element as data-attributes. This is the entire coupling between state
 * and the token layer: @nepal-gov/tokens' CSS selectors ([data-mode], [data-large-text], …) do the
 * rest. Attributes are removed rather than set to a falsy value so the OS-default selectors
 * (:root:not([data-mode])) engage when the user has made no explicit choice.
 */
export function applyTheme(root: HTMLElement, state: ThemeState): void {
  if (state.colorMode) root.setAttribute("data-mode", state.colorMode);
  else root.removeAttribute("data-mode");

  root.toggleAttribute("data-large-text", state.largeText);
  if (state.reducedMotion) root.setAttribute("data-reduced-motion", "true");
  else root.removeAttribute("data-reduced-motion");

  root.setAttribute("data-density", state.density);
  root.setAttribute("lang", state.language);
}

/**
 * The <script> to inline in <head> BEFORE first paint, so the persisted mode is on <html> before
 * any content renders — no flash of the wrong theme. A server layout renders this as a raw string;
 * it deliberately duplicates a little of applyTheme() because it must run without React.
 */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||"{}");var r=document.documentElement;if(s.colorMode)r.setAttribute("data-mode",s.colorMode);if(s.largeText)r.setAttribute("data-large-text","");if(s.reducedMotion)r.setAttribute("data-reduced-motion","true");r.setAttribute("data-density",s.density||"citizen-website");r.setAttribute("lang",s.language||"ne");}catch(e){}})();`;
