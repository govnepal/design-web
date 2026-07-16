"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx.js";

/**
 * Tabs (components/tabs.md) — switch between parallel views of one subject. Implements the WAI-ARIA
 * tabs pattern: role tablist/tab/tabpanel, aria-selected, and a roving tabindex where the arrow
 * keys move between tabs (Home/End to the ends) while Tab moves into the panel. The selected tab is
 * marked by weight + an underline indicator, never colour alone (§4.1).
 *
 * Not for ordered steps (that is the Stepper) or page navigation (that is links).
 */
export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export function Tabs({ tabs, defaultTab, className }: { tabs: TabItem[]; defaultTab?: string; className?: string }) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = (id: string) => {
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      focusTab(tabs[next]!.id);
    }
  };

  return (
    <div className={cx("gov-tabs", className)}>
      <div className="gov-tabs__list" role="tablist">
        {tabs.map((tab, i) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              // Roving tabindex: only the active tab is in the tab order; arrows move within.
              tabIndex={selected ? 0 : -1}
              className="gov-tabs__tab"
              type="button"
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="gov-tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
