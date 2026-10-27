"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import type { Content } from "@/lib/types";
import { Icon, iconFor } from "./icons";
export function TherapyExplorer({ items }: { items: Content[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!items.length)
    return (
      <p className="np-empty">Therapeutic areas will be available soon.</p>
    );
  const selected = items[active] || items[0];
  return (
    <div className="np-therapy" data-reveal>
      <div role="tablist" aria-label="Therapy areas" className="np-therapy__tabs">
        {items.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={"tab-" + x.id}
            aria-controls={i === active ? "panel-" + selected.id : undefined}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let index = i;
              if (e.key === "ArrowRight" || e.key === "ArrowDown")
                index = (i + 1) % items.length;
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                index = (i + items.length - 1) % items.length;
              else if (e.key === "Home") index = 0;
              else if (e.key === "End") index = items.length - 1;
              else return;
              e.preventDefault();
              setActive(index);
              refs.current[index]?.focus();
            }}
          >
            <span className="np-therapy__tabicon">
              <Icon name={iconFor(x.slug)} size={20} />
            </span>
            {x.title}
            <Icon name="arrow" size={18} className="np-therapy__tabarrow" />
          </button>
        ))}
      </div>
      <div
        className="np-therapy__panel"
        role="tabpanel"
        id={"panel-" + selected.id}
        aria-labelledby={"tab-" + selected.id}
        tabIndex={0}
        key={selected.id}
      >
        <div className="np-therapy__glow" aria-hidden="true" />
        <div className="np-therapy__meta">
          <span>{selected.category || "Therapeutic focus"}</span>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <div className="np-therapy__icon" aria-hidden="true">
          <Icon name={iconFor(selected.slug)} size={64} />
        </div>
        <h3>{selected.title}</h3>
        <p>{selected.summary}</p>
        <Link className="np-btn np-btn--light" href={"/therapies/" + selected.slug}>
          Explore {selected.title} <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  );
}
