import Link from "next/link";
import { guidelines } from "@govnepal/tokens";
import { principles } from "@/lib/guidelines";

// A Server Component: it reads the principles from the synced guidelines at build time and ships
// zero client JavaScript. Nothing here is hand-authored guideline content — the principles are
// parsed from the vision-principles chapter (§1.3).
export default function HomePage() {
  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="site-hero">
          <div className="gov-stack gov-stack--6">
            <span className="gov-badge gov-badge--info" style={{ alignSelf: "flex-start" }}>
              Draft · design-guidelines {guidelines.version}
            </span>
            <h1 className="gov-display">Civic Calm</h1>
            <p className="site-hero__lead">
              A calm, official, accessible digital interface style for Government of Nepal services —
              consistent across websites, mobile apps, officer desktops, and kiosks. This site is
              built from the design system&rsquo;s own packages, so it is its own first test.
            </p>
            <div className="gov-cluster">
              <Link className="gov-button gov-button--primary" href="/components">
                View components
              </Link>
              <Link className="gov-button gov-button--secondary" href="/foundations">
                Foundations
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="principles-heading" className="gov-stack gov-stack--6">
          <h2 id="principles-heading">Principles</h2>
          <div className="site-grid">
            {principles.map((p) => (
              <div className="site-card" key={p.no}>
                <h3>{p.title}</h3>
                <p className="gov-text-secondary">{p.meaning}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
