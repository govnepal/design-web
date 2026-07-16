import Link from "next/link";
import type { Metadata } from "next";
import { listChapters } from "@/lib/guidelines";

export const metadata: Metadata = {
  title: "Foundations",
  description: "Layout, colour, typography, iconography, motion, and imagery — the Civic Calm foundations.",
};

const FOLDER = "05-foundations";

export default function FoundationsIndexPage() {
  const chapters = listChapters(FOLDER);
  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--4">
          <h1>Foundations</h1>
          <p className="site-hero__lead">
            The visual foundations of Civic Calm, rendered from the guidelines. The values behind
            them — colours, spacing, the type scale — ship as <code className="gov-reference">@govnepal/tokens</code>.
          </p>
        </section>
        <div className="site-grid">
          {chapters.map((ch) => (
            <Link className="site-card" href={`/foundations/${ch.id}`} key={ch.id}>
              <h3>{ch.title}</h3>
              {ch.summary && <p className="gov-text-secondary">{ch.summary}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
