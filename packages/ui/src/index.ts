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
export { Checkbox } from "./Checkbox.js";
export { RadioGroup, type RadioOption } from "./RadioGroup.js";
export { Select, type SelectOption } from "./Select.js";
export { ErrorSummary, type FieldError } from "./ErrorSummary.js";
export { Alert } from "./Alert.js";
export { Badge } from "./Badge.js";
export { Details } from "./Details.js";
export { WarningText } from "./WarningText.js";
export { PhaseBanner } from "./PhaseBanner.js";
export { Stepper, type Step } from "./Stepper.js";
export { LanguageSwitcher } from "./LanguageSwitcher.js";
export { Emblem, Flag } from "./Emblem.js";
export { Header } from "./Header.js";

// Navigation
export { SkipLink } from "./SkipLink.js";
export { BackLink } from "./BackLink.js";
export { Breadcrumb, type Crumb } from "./Breadcrumb.js";
export { Pagination } from "./Pagination.js";
export { Tabs, type TabItem } from "./Tabs.js";
export { Footer } from "./Footer.js";

// Core / overlays
export { Card } from "./Card.js";
export { IconButton } from "./IconButton.js";
export { Modal } from "./Modal.js";
export { ConfirmationDialog } from "./ConfirmationDialog.js";
export { ToastProvider, useToast } from "./Toast.js";

// Forms / data
export { Toggle } from "./Toggle.js";
export { Textarea } from "./Textarea.js";
export { CharacterCount } from "./CharacterCount.js";
export { SummaryList, type SummaryRow } from "./SummaryList.js";
export { Tag } from "./Tag.js";

// Data display
export { Table, type Column } from "./Table.js";
export { EmptyState } from "./EmptyState.js";
export { LoadingState, Skeleton } from "./LoadingState.js";
export { ProgressBar } from "./ProgressBar.js";
export { Accordion, type AccordionSection } from "./Accordion.js";

// Forms (batch B)
export { PasswordInput } from "./PasswordInput.js";
export { OtpInput } from "./OtpInput.js";
export { AmountInput } from "./AmountInput.js";
export { SearchBox } from "./SearchBox.js";
export { FileUpload } from "./FileUpload.js";
export { AddressBlock, type AddressValue } from "./AddressBlock.js";

// Government / trust
export { MaskedValue } from "./MaskedValue.js";
export { QrCode } from "./QrCode.js";
export { CookieBanner } from "./CookieBanner.js";
export { OfflineBanner } from "./OfflineBanner.js";
export { SessionTimeoutWarning } from "./SessionTimeoutWarning.js";

export { STATUS_TAXONOMY, type StatusId, type StatusEntry, type BadgeVariant } from "./generated/statusTaxonomy.js";
