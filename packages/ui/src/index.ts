/**
 * @govnepal/ui — the Civic Calm React behavior layer.
 *
 * These components add ARIA, keyboard handling, and focus management on top of @govnepal/css.
 * They contain no styling of their own: every visual decision lives in the stylesheet, so a
 * consumer must load @govnepal/css and @govnepal/tokens alongside this package. The split is
 * deliberate — a future Vue or Web Component port re-implements behavior only, never design.
 */

// Server-safe theme utilities come straight from themeCore (no "use client"), so a React Server
// Component — e.g. a Next.js root layout — can inline themeInitScript in <head> without importing
// the client-only provider. The provider and hook come from ThemeProvider ("use client").
export { applyTheme, themeInitScript } from "./themeCore.js";
export type { ColorMode, Language, Calendar, Density, ThemeState } from "./themeCore.js";
export { ThemeProvider, useTheme } from "./ThemeProvider.js";
export type { ThemeContextValue, ThemeProviderProps } from "./ThemeProvider.js";

export { Container, Stack, PageSection } from "./layout.js";
export { Button } from "./Button.js";
export { Link } from "./Link.js";
export { TextInput } from "./TextInput.js";
export { ErrorSummary, type FieldError } from "./ErrorSummary.js";
export { Alert } from "./Alert.js";
export { Badge } from "./Badge.js";
export { Header } from "./Header.js";

export { STATUS_TAXONOMY, type StatusId, type StatusEntry, type BadgeVariant } from "./generated/statusTaxonomy.js";
