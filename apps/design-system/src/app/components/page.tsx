import Link from "next/link";
import type { Metadata } from "next";
import { allComponents } from "@/lib/guidelines";
import { hasExample } from "@/lib/examples";

export const metadata: Metadata = {
  title: "Components",
  description: "The Civic Calm component specifications, with live examples.",
};

const CATEGORY_ORDER = ["layout", "core", "forms", "navigation", "data", "government", "identity"];

export default function ComponentsIndexPage() {
  const components = allComponents();
  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: components.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0);
  const built = components.filter((c) => hasExample(c.id)).length;

  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--4">
          <h1>Components</h1>
          <p className="site-hero__lead">
            {components.length} component specifications from the guidelines. {built} are built in{" "}
            <code className="gov-reference">@govnepal/ui</code> and shown live; the rest are
            specified and awaiting implementation.
          </p>
          <p>
            <Link className="gov-link" href="/components/preview">
              See all ten built components in one live service →
            </Link>
          </p>
        </section>

        {byCategory.map((group) => (
          <section aria-labelledby={`cat-${group.category}`} className="gov-stack gov-stack--4" key={group.category}>
            <h2 id={`cat-${group.category}`} style={{ textTransform: "capitalize" }}>
              {group.category}
            </h2>
            <div className="site-grid">
              {group.items.map((c) => (
                <Link className="site-card" href={`/components/${c.id}`} key={c.id}>
                  <div
                    className="gov-cluster"
                    style={{ justifyContent: "space-between", marginBlockEnd: "var(--gov-space-2)" }}
                  >
                    <h3 style={{ margin: 0 }}>{c.name}</h3>
                    <span className={`gov-badge gov-badge--${hasExample(c.id) ? "success" : "neutral"}`}>
                      {hasExample(c.id) ? "Built" : "Spec"}
                    </span>
                  </div>
                  <p className="gov-text-secondary" style={{ margin: 0 }}>
                    {c.complete ? c.purpose : "Specification in progress."}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
