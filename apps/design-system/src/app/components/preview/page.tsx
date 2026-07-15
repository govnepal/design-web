import Link from "next/link";
import type { Metadata } from "next";
import { LivePreview } from "@/components/LivePreview";

export const metadata: Metadata = {
  title: "Live preview",
  description: "All ten Civic Calm components composed into one service, reviewable in every display mode.",
};

export default function PreviewPage() {
  return (
    <div className="gov-container">
      <div className="gov-stack gov-stack--8">
        <section className="gov-stack gov-stack--4">
          <p>
            <Link className="gov-link gov-link--back" href="/components">
              ← All components
            </Link>
          </p>
          <h1>Live preview</h1>
          <p className="site-hero__lead">
            All ten built components composed into one realistic citizenship service — the real{" "}
            <code className="gov-reference">@nepal-gov/ui</code> components, styled by{" "}
            <code className="gov-reference">@nepal-gov/css</code>. Use the controls to walk the whole
            service through each display mode and either language, the same check an accessibility
            reviewer runs before a release.
          </p>
        </section>
        <LivePreview />
      </div>
    </div>
  );
}
