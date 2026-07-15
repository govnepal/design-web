/**
 * Which component specs have a live example built. Kept in a plain (non-"use client") module so
 * server components — the component index and the [id] spec pages — can call `hasExample` to decide
 * whether to render the client `<Example>` island, without pulling the client bundle into the
 * server render.
 *
 * This list is the ten components implemented in @govnepal/ui so far; it grows as components land.
 */
export const EXAMPLE_IDS = new Set([
  "button",
  "link",
  "badge",
  "alert",
  "text-input",
  "error-summary",
  "header",
  "container",
  "stack",
  "page-section",
  "checkbox",
  "radio",
  "select",
  "details",
  "warning-text",
  "phase-banner",
  "stepper",
  "language-switcher",
  "skip-link",
  "back-link",
  "breadcrumb",
  "card",
  "icon-button",
  "toggle",
  "textarea",
  "tag",
  "footer",
  "tabs",
  "pagination",
  "toast",
  "modal",
  "confirmation-dialog",
  "summary-list",
  "character-count",
  "table",
  "empty-state",
  "loading-state",
  "accordion",
  "progress-bar",
  "password-input",
  "otp-input",
  "amount-input",
  "address-block",
  "masked-value",
  "file-upload",
  "search-box",
  "cookie-banner",
  "offline-banner",
  "session-timeout-warning",
]);

export function hasExample(id: string): boolean {
  return EXAMPLE_IDS.has(id);
}
