/** Template ids that have a live rendering (server-safe, so the pages can gate on it). */
export const TEMPLATE_EXAMPLE_IDS = new Set([
  "service-start",
  "question-page",
  "check-answers",
  "confirmation-page",
  "sign-in",
  "search-results",
  "dashboard",
  "error-not-found",
  "error-server",
  "error-offline",
  "error-maintenance",
]);

export function hasTemplate(id: string): boolean {
  return TEMPLATE_EXAMPLE_IDS.has(id);
}
