import Link from "next/link";
import type { Content, Section } from "@/lib/types";
import { Visual } from "./visual";
export function SectionHead({
  section,
  href,
}: {
  section: Section;
  href?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <div className="section-label">
          <span className="label-line" />
          {section.eyebrow}
        </div>
        <h2 className="section-title">{section.title}</h2>
      </div>
      <div className="section-head-side">
        <p>{section.description}</p>
        {href && (
          <Link className="inline-link" href={href}>
            Explore more <span>↗</span>
          </Link>
        )}
      </div>
    </div>
  );
}
export function OfferingCards({ items }: { items: Content[] }) {
  return (
    <div className="offerings-grid">
      {items.map((x, i) => (
        <Link
          href={"/offerings/" + x.slug}
          key={x.id}
          className={"offering-card offering-card-" + ((i % 4) + 1)}
        >
          <span className="offering-index">
            {String(i + 1).padStart(2, "0")} / {x.category || "HEALTHCARE"}
          </span>
          {x.imageUrl ? (
            <div className="offering-drawing">
              <Visual src={x.imageUrl} alt="" />
            </div>
          ) : (
            <div
              className={
                "offering-drawing " +
                [
                  "capsule-drawing",
                  "pulse-drawing",
                  "building-drawing",
                  "molecule-drawing",
                ][i % 4]
              }
              aria-hidden="true"
            >
              {i % 4 === 0 ? (
                <>
                  <span />
                  <span />
                  <span />
                </>
              ) : i % 4 === 2 ? (
                <>
                  <span className="tower tower1" />
                  <span className="tower tower2" />
                  <span className="tower tower3" />
                </>
              ) : (
                <svg viewBox="0 0 250 150">
                  <path
                    d={
                      i % 4 === 1
                        ? "M2 84h56l21-36 32 70 23-83 24 50 20-16h70"
                        : "M40 90 86 30 138 65 185 109 106 132Z M86 30 106 132 M40 90 138 65"
                    }
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="4"
                  />
                  {i % 4 === 3 &&
                    [40, 86, 138, 185, 106].map((v, j) => (
                      <circle
                        key={v}
                        cx={v}
                        cy={[90, 30, 65, 109, 132][j]}
                        r="8"
                        fill="currentColor"
                      />
                    ))}
                </svg>
              )}
            </div>
          )}
          <div className="offering-bottom">
            <h3>{x.title}</h3>
            <p>{x.summary}</p>
            <span className="offering-arrow">↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function StoryCards({ items }: { items: Content[] }) {
  return (
    <div className="story-grid">
      {items.map((x) => (
        <Link className="story-card" href={"/news/" + x.slug} key={x.id}>
          <div className="story-image">
            <Visual src={x.imageUrl} alt="" />
          </div>
          <div>
            <span className="section-kicker">
              {x.category || "PERSPECTIVE"}
            </span>
            <h3>{x.title}</h3>
            <p>{x.summary}</p>
            <span className="inline-link">Read story ↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
