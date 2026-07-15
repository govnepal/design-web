import Link from "next/link";
import type { Metadata } from "next";
import { allTemplates } from "@/lib/guidelines";
import { hasTemplate } from "@/lib/templateExamples";

export const metadata: Metadata = {
  title: "Templates",
  description: "Whole-page archetypes composed from the Civic Calm components — real service pages.",
};

export default function TemplatesIndexPage() {
  const templates = allTemplates();
  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--4">
          <h1>Templates</h1>
          <p className="site-hero__lead">
            Whole-page archetypes — a pattern&rsquo;s steps render inside these. Each is composed
            entirely from <code className="gov-reference">@govnepal/ui</code> components and shown
            live, previewable in every display mode.
          </p>
        </section>
        <div className="site-grid">
          {templates.map((t) => (
            <Link className="site-card" href={`/templates/${t.id}`} key={t.id}>
              <div className="gov-cluster" style={{ justifyContent: "space-between", marginBlockEnd: "var(--gov-space-2)" }}>
                <h3 style={{ margin: 0 }}>{t.name}</h3>
                <span className={`gov-badge gov-badge--${hasTemplate(t.id) ? "success" : "neutral"}`}>
                  {hasTemplate(t.id) ? "Live" : "Spec"}
                </span>
              </div>
              <p className="gov-text-secondary" style={{ margin: 0 }}>{t.purpose}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
