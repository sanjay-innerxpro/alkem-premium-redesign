import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDict,
  siteContent,
  siteItem,
  siteSettings,
} from "@/lib/i18n-server";
import { collections, type Collection } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import { OfferingCards, StoryCards } from "@/components/cards";
import { ProductBrowser } from "@/components/product-browser";
import { TherapyExplorer } from "@/components/therapy-explorer";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
import { Banner } from "@/components/banner";
import { Icon } from "@/components/icons";
const labelKeys: Record<string, keyof Dict> = {
  products: "lbl_products",
  offerings: "lbl_offerings",
  therapies: "lbl_therapies",
  news: "lbl_news",
  careers: "lbl_careers",
  contact: "lbl_contact",
  privacy: "lbl_privacy",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const [page, t] = await Promise.all([siteItem("pages", section), getDict()]);
  return {
    title:
      page?.title || (labelKeys[section] ? t[labelKeys[section]] : section),
  };
}
export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { section } = await params;
  const [s, t] = await Promise.all([siteSettings(), getDict()]);
  if (section === "contact") {
    const channels = [
      s.contactEmail && [
        "mail",
        t.email_us,
        s.contactEmail,
        "mailto:" + s.contactEmail,
      ],
      s.contactPhone && [
        "phone",
        t.call_us,
        s.contactPhone,
        "tel:" + s.contactPhone.replace(/\s/g, ""),
      ],
      s.contactAddress && ["pin", t.visit_us, s.contactAddress, ""],
    ].filter(Boolean) as string[][];
    return (
      <main id="main">
        <Banner
          label={t.lbl_contact}
          home={t.home}
          title={s.sections.contact.title}
          text={s.sections.contact.description}
        />
        <section className="np-section">
          <div className="np-wrap np-contact">
            <aside className="np-contact__info" data-reveal>
              <h2 className="np-h3">
                {t.start_a}{" "}
                <em className="np-gradient-text">{t.conversation}</em>
              </h2>
              <p className="np-lead">{t.contact_lead}</p>
              <div className="np-channels">
                {channels.map(([icon, label, value, href]) => {
                  const inner = (
                    <>
                      <span className="np-icon-chip">
                        <Icon name={icon} size={22} />
                      </span>
                      <div>
                        <small>{label}</small>
                        <strong>
                          <bdi>{value}</bdi>
                        </strong>
                      </div>
                    </>
                  );
                  return href ? (
                    <a className="np-channel" href={href} key={icon}>
                      {inner}
                    </a>
                  ) : (
                    <div className="np-channel" key={icon}>
                      {inner}
                    </div>
                  );
                })}
                {!channels.length && (
                  <div className="np-channel">
                    <span className="np-icon-chip">
                      <Icon name="mail" size={22} />
                    </span>
                    <div>
                      <small>{t.write_to_us}</small>
                      <strong>{t.form_respond}</strong>
                    </div>
                  </div>
                )}
              </div>
            </aside>
            <div className="np-card np-contact__form" data-reveal>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    );
  }
  if (section === "privacy")
    return (
      <main id="main">
        <Banner
          label={t.lbl_privacy}
          home={t.home}
          title={t.privacy_title}
          text={t.privacy_intro}
        />
        <section className="np-section">
          <div className="np-wrap np-article">
            <div className="np-prose">
              <p>{t.privacy_1}</p>
              <p>{t.privacy_2}</p>
              <p>{t.privacy_3}</p>
            </div>
          </div>
        </section>
      </main>
    );
  if (collections.includes(section as Collection) && section !== "pages") {
    const collection = section as Collection;
    const label = t[labelKeys[section]];
    const query = await searchParams;
    const q = (query.q || "").trim().slice(0, 150);
    const cat = (query.cat || "").slice(0, 100);
    const all = await siteContent(collection);
    const head =
      s.sections[
        section as "products" | "offerings" | "therapies" | "news" | "careers"
      ];
    if (section === "products" && all.length)
      return (
        <main id="main">
          <Banner
            label={label}
            home={t.home}
            title={head.title}
            text={head.description}
          />
          <section className="np-section np-section--browse">
            <div className="np-wrap">
              <ProductBrowser
                items={all}
                initialQ={q}
                initialCat={cat}
                note={s.productsNote}
              />
            </div>
          </section>
        </main>
      );
    const items = all.filter((x) =>
      (x.title + " " + x.summary + " " + x.location)
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
    return (
      <main id="main">
        <Banner
          label={label}
          home={t.home}
          title={head.title}
          text={head.description}
        />
        <section className="np-section">
          <div className="np-wrap">
            <form className="np-search" role="search">
              <label htmlFor="content-search" className="np-sr">
                {t.search} {label}
              </label>
              <Icon name="search" size={20} />
              <input
                id="content-search"
                name="q"
                defaultValue={q}
                maxLength={150}
                placeholder={t.search_placeholder}
              />
              {q && (
                <Link className="np-search__clear" href={"/" + section}>
                  {t.clear}
                </Link>
              )}
              <button className="np-btn np-btn--primary np-btn--sm">
                {t.search}
              </button>
            </form>
            {items.length === 0 ? (
              <div className="np-empty">
                <span className="np-icon-chip">
                  <Icon name={q ? "search" : "sparkle"} size={24} />
                </span>
                <h2>{q ? t.no_results : t.more_on_way}</h2>
                <p>
                  {q
                    ? t.try_different
                    : section === "careers"
                      ? t.no_positions
                      : t.content_soon}
                </p>
                {section === "careers" && !q && (
                  <Link className="np-btn np-btn--primary" href="/contact">
                    {t.contact_us} <Icon name="arrow" size={18} />
                  </Link>
                )}
              </div>
            ) : section === "offerings" ? (
              <OfferingCards items={items} />
            ) : section === "therapies" ? (
              <TherapyExplorer items={items} />
            ) : section === "news" ? (
              <StoryCards
                items={items}
                readLabel={t.read_story}
                fallbackCategory={t.perspective}
              />
            ) : (
              <div className="np-jobs">
                {items.map((x) => (
                  <Link
                    className="np-job"
                    href={"/careers/" + x.slug}
                    key={x.id}
                    data-reveal
                  >
                    <div>
                      <span className="np-tag">
                        {x.category || t.opportunity}
                      </span>
                      <h2>{x.title}</h2>
                      <p>
                        {[x.location, x.employmentType]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="np-round">
                      <Icon name="arrow" size={20} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }
  const page = await siteItem("pages", section);
  if (!page) notFound();
  return (
    <main id="main">
      <Banner
        label={page.category || t.our_world}
        home={t.home}
        title={page.title}
        text={page.summary}
      />
      <section className="np-section">
        <div
          className={
            "np-wrap np-article" + (page.imageUrl ? " np-article--media" : "")
          }
        >
          {page.imageUrl && (
            <div className="np-article__visual" data-reveal>
              <Visual src={page.imageUrl} alt={page.title} />
            </div>
          )}
          <div className="np-prose" data-reveal>
            {page.body.split(/\n\s*\n/).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            <Link className="np-btn np-btn--primary" href="/contact">
              {t.talk_team} <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
