import type { GuidanceItem } from "@/lib/guidelines";

/**
 * Do / don't cards rendered from a spec's `guidance:` frontmatter. Guidance is structured data in
 * the guidelines (not prose), so it renders as paired cards here rather than being reformatted by
 * hand — the do, the don't, and the why, exactly as the spec states them. A Server Component: no
 * client JS.
 */
export function Guidance({ items }: { items: GuidanceItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="guidance">
      {items.map((item) => (
        <div className="guidance__item" key={item.id}>
          <div className="guidance__do">
            <span className="guidance__marker" aria-hidden="true">
              Do
            </span>
            <span>{item.do}</span>
          </div>
          <div className="guidance__dont">
            <span className="guidance__marker" aria-hidden="true">
              Don&rsquo;t
            </span>
            <span>{item.dont}</span>
          </div>
          <p className="guidance__why">{item.why}</p>
        </div>
      ))}
    </div>
  );
}
