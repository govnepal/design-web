import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// The docs site must pass the standard it publishes: §8.1's performance budget (≤300 KB initial,
// no render-blocking third-party JS) and progressive enhancement (§8.1's website rules). Astro
// ships zero JS by default and renders to static HTML; only the components explicitly marked as
// islands (the live examples, the mode panel) hydrate. That is what keeps a content page inside
// the budget while still demonstrating the real React components.
export default defineConfig({
  integrations: [react()],
  // Static output: the guideline document is content, pinned to a guidelines version, rebuilt on
  // change — not a per-request app. Matches how design-guidelines itself publishes.
  output: "static",
  build: {
    // One stylesheet link, not many — fewer render-blocking requests on a throttled 3G connection.
    inlineStylesheets: "auto",
  },
});
