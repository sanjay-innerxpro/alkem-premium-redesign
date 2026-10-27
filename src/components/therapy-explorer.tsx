"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import type { Content } from "@/lib/types";
export function TherapyExplorer({ items }: { items: Content[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!items.length)
    return (
      <p className="empty-state">Therapeutic areas will be available soon.</p>
    );
  const selected = items[active] || items[0];
  return (
    <div className="therapy-explorer">
      <div
        role="tablist"
        aria-label="Therapy areas"
        className="therapy-controls"
      >
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
            {x.title}
            <span>↗</span>
          </button>
        ))}
      </div>
      <div
        className="therapy-display"
        role="tabpanel"
        id={"panel-" + selected.id}
        aria-labelledby={"tab-" + selected.id}
        tabIndex={0}
      >
        <div className="therapy-topline">
          <span>{selected.category || "THERAPEUTIC FOCUS"}</span>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <div className="therapy-illustration" aria-hidden="true">
          <svg viewBox="0 0 250 240">
            <path
              d="M125 204s-84-55-84-116a49 49 0 0 1 84-34 49 49 0 0 1 84 34c0 61-84 116-84 116Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M50 119h46l14-30 24 61 21-40 12 9h32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </div>
        <h3>{selected.title}</h3>
        <p>{selected.summary}</p>
        <Link href={"/therapies/" + selected.slug}>
          Explore this area <span>↗</span>
        </Link>
      </div>
    </div>
  );
}
