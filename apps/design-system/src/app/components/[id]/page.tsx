import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, listComponentIds } from "@/lib/guidelines";
import { hasExample } from "@/lib/examples";
import { Guidance } from "@/components/Guidance";
import { Example } from "@/components/Example";

// Static export needs the full set of ids up front.
export function generateStaticParams() {
  return listComponentIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = getComponent(id);
  return { title: c.name, description: c.purpose };
}

export default async function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!listComponentIds().includes(id)) notFound();
  const c = getComponent(id);
  const guidance = c.guidance ?? [];

  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--3">
          <p>
            <Link className="gov-link gov-link--back" href="/components">
              ← All components
            </Link>
          </p>
          <div className="gov-cluster" style={{ justifyContent: "space-between" }}>
            <h1 style={{ margin: 0 }}>{c.name}</h1>
            <span className={`gov-badge gov-badge--${hasExample(c.id) ? "success" : "neutral"}`}>
              {hasExample(c.id) ? "Built" : "Spec only"}
            </span>
          </div>
          {c.name_ne && (
            <p className="gov-text-secondary" lang="ne">
              {c.name_ne}
            </p>
          )}
          {c.complete && <p className="site-hero__lead">{c.purpose}</p>}
        </section>

        {hasExample(c.id) && (
          <section aria-labelledby="example-heading" className="gov-stack gov-stack--4">
            <h2 id="example-heading">Live example</h2>
            {/* Only this island hydrates; the spec prose below is static HTML. */}
            <Example id={c.id} />
          </section>
        )}

        {guidance.length > 0 && (
          <section aria-labelledby="guidance-heading" className="gov-stack gov-stack--4">
            <h2 id="guidance-heading">Do and don&rsquo;t</h2>
            <Guidance items={guidance} />
          </section>
        )}

        {/* The full spec prose, rendered from the guideline markdown. */}
        <section className="prose" dangerouslySetInnerHTML={{ __html: c.bodyHtml }} />

        {c.tokens && c.tokens.length > 0 && (
          <section aria-labelledby="tokens-heading" className="gov-stack gov-stack--3">
            <h2 id="tokens-heading">Tokens consumed</h2>
            <div className="gov-cluster">
              {c.tokens.map((t) => (
                <code className="gov-reference gov-text-small" key={t}>
                  {t}
                </code>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
