"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  loadPersistedTheme,
  THEME_DEFAULTS,
  THEME_STORAGE_KEY,
  type ColorMode,
  type ThemeState,
} from "./themeCore.js";

// Server-safe utilities and types live in themeCore; re-export them so consumers have one import.
export { applyTheme, themeInitScript } from "./themeCore.js";
export type { ColorMode, Language, Calendar, Density, ThemeState } from "./themeCore.js";

/**
 * The theme provider — the single place where rendering context is set (§10.2, normative).
 *
 * It controls display mode, language, calendar, and density, applies them as root attributes that
 * @govnepal/tokens keys off, and persists the user's choices. Exactly one provider is expected at
 * the application root; a nested provider may override the DISPLAY MODE for a subtree (a mode
 * preview) but nothing else — language never changes mid-page except through a visible switcher.
 */

export interface ThemeContextValue extends ThemeState {
  setColorMode: (mode: ColorMode | undefined) => void;
  setLargeText: (on: boolean) => void;
  setReducedMotion: (on: boolean) => void;
  setLanguage: (language: ThemeState["language"]) => void;
  setCalendar: (calendar: ThemeState["calendar"]) => void;
  /** The active mode after OS fallback is resolved — for a UI that needs the current state. */
  resolvedColorMode: ColorMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps extends Partial<ThemeState> {
  children: ReactNode;
  /**
   * A nested provider overrides only the display mode for its subtree (§10.2 — a mode preview).
   * It renders a wrapper element carrying the mode attributes and does not touch <html>, storage,
   * language, or the OS listeners.
   */
  nested?: boolean;
  /** Persist device-side changes. A signed-in app sets this false and persists to the account. */
  persist?: boolean;
  /** Called on any change, so a signed-in app can write the choice to the user's account. */
  onChange?: (state: ThemeState) => void;
}

export function ThemeProvider({
  children,
  nested = false,
  persist = true,
  onChange,
  ...overrides
}: ThemeProviderProps): ReactNode {
  const [state, setState] = useState<ThemeState>(() => ({
    ...THEME_DEFAULTS,
    ...(nested ? {} : loadPersistedTheme()),
    ...overrides,
  }));

  const nestedRef = useRef<HTMLDivElement>(null);

  // An override prop that CHANGES after mount wins — this is what makes a nested mode-preview panel
  // reactive: change its `colorMode` prop and the subtree updates. A prop that stays constant does
  // not clobber a user's own switcher choice, because the effect fires only on a real value change.
  const overridesKey = JSON.stringify(overrides);
  useEffect(() => {
    const next = JSON.parse(overridesKey) as Partial<ThemeState>;
    if (Object.keys(next).length > 0) setState((prev) => ({ ...prev, ...next }));
  }, [overridesKey]);

  // Apply to <html> for the root provider, or to the wrapper div for a nested one.
  useEffect(() => {
    if (nested) {
      if (nestedRef.current) applyTheme(nestedRef.current, state);
    } else if (typeof document !== "undefined") {
      applyTheme(document.documentElement, state);
    }
  }, [nested, state]);

  // Persist and notify on change (root provider only — a nested preview is ephemeral).
  useEffect(() => {
    if (nested) return;
    if (persist && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
      } catch {
        // A private-mode browser can refuse storage; the choice still holds for the session.
      }
    }
    onChange?.(state);
  }, [nested, persist, onChange, state]);

  // Track the OS color preference so `resolvedColorMode` is accurate while colorMode is undefined.
  const [osMode, setOsMode] = useState<ColorMode>("light");
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const dark = matchMedia("(prefers-color-scheme: dark)");
    const contrast = matchMedia("(prefers-contrast: more)");
    const resolve = () => setOsMode(contrast.matches ? "high-contrast" : dark.matches ? "dark" : "light");
    resolve();
    dark.addEventListener("change", resolve);
    contrast.addEventListener("change", resolve);
    return () => {
      dark.removeEventListener("change", resolve);
      contrast.removeEventListener("change", resolve);
    };
  }, []);

  const update = useCallback((partial: Partial<ThemeState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      resolvedColorMode: state.colorMode ?? osMode,
      setColorMode: (colorMode) => update({ colorMode }),
      setLargeText: (largeText) => update({ largeText }),
      setReducedMotion: (reducedMotion) => update({ reducedMotion }),
      setLanguage: (language) => update({ language }),
      setCalendar: (calendar) => update({ calendar }),
    }),
    [state, osMode, update],
  );

  if (nested) {
    return (
      <ThemeContext.Provider value={value}>
        <div ref={nestedRef}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within a <ThemeProvider>. It is the app's single root provider (§10.2).");
  }
  return value;
}
