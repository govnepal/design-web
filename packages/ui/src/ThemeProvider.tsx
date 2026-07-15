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

/**
 * The theme provider — the single place where rendering context is set (§10.2, normative).
 *
 * It controls display mode, language, calendar, and density, applies them as root attributes that
 * @nepal-gov/tokens keys off, and persists the user's choices. Exactly one provider is expected at
 * the application root; a nested provider may override the DISPLAY MODE for a subtree (a mode
 * preview) but nothing else — language never changes mid-page except through a visible switcher.
 */

/** The four color modes (§5.2). large-text and reduced-motion are separate, composable flags. */
export type ColorMode = "light" | "dark" | "high-contrast" | "color-blind-safe";
export type Language = "ne" | "en";
export type Calendar = "BS" | "AD";
/** Matches data/density-rules.yaml ids; the tokens package's generated type is the source list. */
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

export interface ThemeContextValue extends ThemeState {
  setColorMode: (mode: ColorMode | undefined) => void;
  setLargeText: (on: boolean) => void;
  setReducedMotion: (on: boolean) => void;
  setLanguage: (language: Language) => void;
  setCalendar: (calendar: Calendar) => void;
  /** The active mode after OS fallback is resolved — for a UI that needs to show the current state. */
  resolvedColorMode: ColorMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULTS: ThemeState = {
  colorMode: undefined,
  largeText: false,
  reducedMotion: false,
  language: "ne", // Nepali-first (Article 7) — the default language of official business.
  calendar: "BS", // Bikram Sambat is the administrative calendar of record (§3.1).
  density: "citizen-website",
};

const STORAGE_KEY = "gov-theme";

/** Read persisted choices. Device storage is the fallback; a signed-in app passes them via props. */
function loadPersisted(): Partial<ThemeState> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ThemeState>) : {};
  } catch {
    return {};
  }
}

/**
 * Apply the theme to a root element as data-attributes. This is the entire coupling between React
 * and the token layer: @nepal-gov/tokens' CSS selectors ([data-mode], [data-large-text], …) do the
 * rest. Attributes are removed rather than set to a falsy value so the OS-default selectors
 * (:root:not([data-mode])) engage when the user has made no explicit choice.
 */
export function applyTheme(root: HTMLElement, state: ThemeState): void {
  if (state.colorMode) root.setAttribute("data-mode", state.colorMode);
  else root.removeAttribute("data-mode");

  root.toggleAttribute("data-large-text", state.largeText);
  // Only force reduced-motion ON; when off, leave the OS preference to the @media query, so a
  // user who set it at the OS level still gets it without toggling it again here.
  if (state.reducedMotion) root.setAttribute("data-reduced-motion", "true");
  else root.removeAttribute("data-reduced-motion");

  root.setAttribute("data-density", state.density);
  root.setAttribute("lang", state.language);
}

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
    ...DEFAULTS,
    ...(nested ? {} : loadPersisted()),
    ...overrides,
  }));

  const nestedRef = useRef<HTMLDivElement>(null);

  // An override prop that CHANGES after mount wins — this is what makes a nested mode-preview
  // panel (the docs site's ThemePanel) reactive: change its `colorMode` prop and the subtree
  // updates. A prop that stays constant does not clobber a user's own switcher choice, because
  // the effect only fires when the prop's value actually changes.
  const overridesKey = JSON.stringify(overrides);
  useEffect(() => {
    const next = JSON.parse(overridesKey) as Partial<ThemeState>;
    if (Object.keys(next).length > 0) setState((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- overridesKey is the stable digest.
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

/**
 * The <script> to inline in <head> BEFORE first paint, so the persisted mode is on <html> before
 * any content renders — no flash of the wrong theme. SSR frameworks render this as a raw string;
 * it deliberately duplicates a little of applyTheme() because it must run without React.
 */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"{}");var r=document.documentElement;if(s.colorMode)r.setAttribute("data-mode",s.colorMode);if(s.largeText)r.setAttribute("data-large-text","");if(s.reducedMotion)r.setAttribute("data-reduced-motion","true");r.setAttribute("data-density",s.density||"citizen-website");r.setAttribute("lang",s.language||"ne");}catch(e){}})();`;
