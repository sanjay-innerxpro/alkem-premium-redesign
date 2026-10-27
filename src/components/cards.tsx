import Link from "next/link";
import type { Content, Section } from "@/lib/types";
import { Visual } from "./visual";
import { Icon, iconFor, iconForForm } from "./icons";
export function Eyebrow({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span className={"np-eyebrow" + (light ? " np-eyebrow--light" : "")}>
      <i />
      {children}
    </span>
  );
}
export function SectionHead({
  section,
  href,
  light,
}: {
  section: Section;
  href?: string;
  light?: boolean;
}) {
  return (
    <div className={"np-head" + (light ? " np-head--light" : "")} data-reveal>
      <div>
        <Eyebrow light={light}>{section.eyebrow}</Eyebrow>
        <h2 className="np-h2">{section.title}</h2>
      </div>
      <div className="np-head__side">
        <p>{section.description}</p>
        {href && (
          <Link className="np-link" href={href}>
            Explore all <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function OfferingCards({ items }: { items: Content[] }) {
  return (
    <div className="np-bento">
      {items.map((x, i) => (
        <Link
          href={"/offerings/" + x.slug}
          key={x.id}
          className={"np-bento__card np-bento__card--" + ((i % 4) + 1)}
          data-reveal
          style={{ "--d": i * 80 + "ms" } as React.CSSProperties}
        >
          <div className="np-bento__top">
            <span className="np-icon-chip">
              <Icon name={iconFor(x.slug, "pill")} size={26} />
            </span>
            <span className="np-bento__index">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          {x.imageUrl && (
            <div className="np-bento__media">
              <Visual src={x.imageUrl} alt="" />
            </div>
          )}
          <div className="np-bento__body">
            {x.category && <span className="np-tag">{x.category}</span>}
            <h3>{x.title}</h3>
            <p>{x.summary}</p>
          </div>
          <span className="np-bento__arrow">
            <Icon name="arrow" size={20} />
          </span>
        </Link>
      ))}
    </div>
  );
}
const tones = ["teal", "sky", "violet", "mint", "rose"];
export function ProductCards({ items }: { items: Content[] }) {
  // A stable colour per therapy area keeps the grid varied but consistent.
  const areas = [...new Set(items.map((x) => x.category))];
  return (
    <div className="np-products">
      {items.map((x, i) => (
        <Link
          href={"/products/" + x.slug}
          key={x.id}
          className={
            "np-product np-product--" +
            tones[Math.max(0, areas.indexOf(x.category)) % tones.length]
          }
          data-reveal
          style={{ "--d": (i % 4) * 60 + "ms" } as React.CSSProperties}
        >
          <div className="np-product__media">
            {x.imageUrl ? (
              <Visual src={x.imageUrl} alt="" />
            ) : (
              <span className="np-product__pack" aria-hidden="true">
                <Icon name={iconForForm(x.dosageForm)} size={34} />
              </span>
            )}
            {x.dosageForm && <span className="np-product__form">{x.dosageForm}</span>}
          </div>
          <div className="np-product__body">
            {x.category && <span className="np-product__area">{x.category}</span>}
            <h3>{x.title}</h3>
            {x.composition && <p>{x.composition}</p>}
            <div className="np-product__foot">
              <span>{x.packSize}</span>
              <Icon name="arrow" size={18} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function StoryCards({ items }: { items: Content[] }) {
  return (
    <div className="np-stories">
      {items.map((x, i) => (
        <Link
          className="np-story"
          href={"/news/" + x.slug}
          key={x.id}
          data-reveal
          style={{ "--d": i * 80 + "ms" } as React.CSSProperties}
        >
          <div className="np-story__media">
            <Visual src={x.imageUrl} alt="" />
          </div>
          <div className="np-story__body">
            <span className="np-tag">{x.category || "Perspective"}</span>
            <h3>{x.title}</h3>
            <p>{x.summary}</p>
            <span className="np-link">
              Read story <Icon name="arrow" size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
