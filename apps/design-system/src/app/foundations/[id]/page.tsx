import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listChapters } from "@/lib/guidelines";

const FOLDER = "05-foundations";

export function generateStaticParams() {
  return listChapters(FOLDER).map((ch) => ({ id: ch.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ch = listChapters(FOLDER).find((c) => c.id === id);
  return ch ? { title: ch.title, description: ch.summary } : {};
}

export default async function FoundationChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = listChapters(FOLDER).find((c) => c.id === id);
  if (!chapter) notFound();

  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--3">
          <p>
            <Link className="gov-link gov-link--back" href="/foundations">
              ← Foundations
            </Link>
          </p>
          <h1>{chapter.title}</h1>
          {chapter.title_ne && (
            <p className="gov-text-secondary" lang="ne">
              {chapter.title_ne}
            </p>
          )}
        </section>
        <section className="prose" dangerouslySetInnerHTML={{ __html: chapter.bodyHtml }} />
      </div>
    </div>
  );
}
