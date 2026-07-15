/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the guideline document is content pinned to a guidelines version, rebuilt on
  // change — not a per-request app. This produces plain HTML + hydration for the interactive
  // islands only, matching how design-guidelines itself publishes, and keeps the site deployable
  // as static files (Vercel, GitHub Pages, any bucket).
  output: "export",
  // The site must pass the standard it publishes (§8.1). Server Components ship no client JS, so
  // content pages (home, foundations, component specs) hydrate nothing; only the mode panel and
  // switcher are client components. Trailing slashes keep static hosting tidy.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
