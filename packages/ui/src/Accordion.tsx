"use client";

import { useId, useState, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Accordion (components/accordion.md) — several independent expandable sections of long content.
 * Each header is a <button> with aria-expanded/aria-controls; focus stays on the header after
 * toggling (never jumps into the revealed content). Multiple sections may be open. For a single
 * inline aside, use Details instead.
 */
export interface AccordionSection {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export function Accordion({ sections, className }: { sections: AccordionSection[]; className?: string }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className={cx("gov-accordion", className)}>
      {sections.map((section) => {
        const expanded = open.has(section.id);
        const panelId = `${baseId}-${section.id}`;
        return (
          <div className="gov-accordion__section" key={section.id}>
            <button
              type="button"
              className="gov-accordion__header"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(section.id)}
            >
              {section.title}
              <svg className="gov-accordion__chevron" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div id={panelId} className="gov-accordion__panel" hidden={!expanded}>
              {section.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
