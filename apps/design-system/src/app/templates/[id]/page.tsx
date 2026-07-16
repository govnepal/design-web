import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplate, listTemplateIds } from "@/lib/guidelines";
import { hasTemplate } from "@/lib/templateExamples";
import { TemplateExample } from "@/components/TemplateExample";

export function generateStaticParams() {
  return listTemplateIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = getTemplate(id);
  return { title: t.name, description: t.purpose };
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!listTemplateIds().includes(id)) notFound();
  const t = getTemplate(id);

  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--3">
          <p><Link className="gov-link gov-link--back" href="/templates">← All templates</Link></p>
          <h1>{t.name}</h1>
          {t.purpose && <p className="site-hero__lead">{t.purpose}</p>}
          {t.composedOf && (
            <p className="gov-text-secondary gov-text-small">
              Composed of: {t.composedOf.join(", ")}
            </p>
          )}
        </section>

        {hasTemplate(t.id) && (
          <section aria-labelledby="tpl-live" className="gov-stack gov-stack--4">
            <h2 id="tpl-live">Live template</h2>
            <TemplateExample id={t.id} />
          </section>
        )}

        <section className="prose" dangerouslySetInnerHTML={{ __html: t.bodyHtml }} />
      </div>
    </div>
  );
}
