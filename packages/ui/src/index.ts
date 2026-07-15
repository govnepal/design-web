/**
 * @nepal-gov/ui — the Civic Calm React behavior layer.
 *
 * These components add ARIA, keyboard handling, and focus management on top of @nepal-gov/css.
 * They contain no styling of their own: every visual decision lives in the stylesheet, so a
 * consumer must load @nepal-gov/css and @nepal-gov/tokens alongside this package. The split is
 * deliberate — a future Vue or Web Component port re-implements behavior only, never design.
 */

export { ThemeProvider, useTheme, applyTheme, themeInitScript } from "./ThemeProvider.js";
export type {
  ColorMode,
  Language,
  Calendar,
  Density,
  ThemeState,
  ThemeContextValue,
  ThemeProviderProps,
} from "./ThemeProvider.js";

export { Container, Stack, PageSection } from "./layout.js";
export { Button } from "./Button.js";
export { Link } from "./Link.js";
export { TextInput } from "./TextInput.js";
export { ErrorSummary, type FieldError } from "./ErrorSummary.js";
export { Alert } from "./Alert.js";
export { Badge } from "./Badge.js";
export { Header } from "./Header.js";

export { STATUS_TAXONOMY, type StatusId, type StatusEntry, type BadgeVariant } from "./generated/statusTaxonomy.js";
