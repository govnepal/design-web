import type { ReactNode } from "react";
import type { Metadata } from "next";
import { themeInitScript } from "@nepal-gov/ui";
import { guidelinesVersion } from "@/lib/guidelines";
import { SiteNav } from "@/components/SiteNav";

// The three package stylesheets, imported once at the root so Next bundles them. @nepal-gov/css
// carries the self-hosted Noto fonts (§9.2 prohibits CDN fonts); the bundler resolves the woff2
// URLs from the package.
import "@nepal-gov/tokens/tokens.css";
import "@nepal-gov/css/fonts.css";
import "@nepal-gov/css/civic-calm.css";
import "@/styles/site.css";

export const metadata: Metadata = {
  title: { default: "Civic Calm", template: "%s — Civic Calm" },
  description:
    "An unofficial, community-led digital design system for Government of Nepal services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const version = guidelinesVersion();
  return (
    // Default lang is English chrome; individual Nepali passages carry their own lang. The theme
    // provider sets the effective lang client-side once a visitor chooses.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so the persisted display mode is on <html> before any content
            renders — no flash of the wrong theme. It is the one inline script the site ships. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a className="gov-skip-link" href="#main">
          Skip to main content
        </a>
        <SiteNav />
        <main id="main" className="site-main">
          {children}
        </main>
        <footer className="site-footer">
          <div className="gov-container">
            <p className="gov-text-secondary gov-text-small">
              An unofficial, community-led design system. Built from design-guidelines{" "}
              <code className="gov-reference">{version.version}</code> ({version.status}).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
