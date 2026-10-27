import Link from "next/link";
import { getDict, siteContent, siteSettings } from "@/lib/i18n-server";
import { Visual } from "@/components/visual";
import {
  Eyebrow,
  OfferingCards,
  ProductCards,
  SectionHead,
  StoryCards,
} from "@/components/cards";
import { TherapyExplorer } from "@/components/therapy-explorer";
import { Icon } from "@/components/icons";
export async function generateMetadata() {
  const s = await siteSettings();
  return { title: { absolute: s.seoTitle }, description: s.seoDescription };
}
const pillars = [
  ["shield", "p1"],
  ["users", "p2"],
  ["award", "p3"],
] as const;
const steps = [
  ["flask", "s1"],
  ["dna", "s2"],
  ["factory", "s3"],
  ["truck", "s4"],
] as const;
export default async function Home() {
  const [s, items, t] = await Promise.all([
    siteSettings(),
    siteContent(),
    getDict(),
  ]);
  const sec = s.sections;
  const group = (name: string) => items.filter((x) => x.collection === name);
  const therapies = group("therapies");
  const ticker = [
    ...therapies.map((x) => x.title),
    t.quality_assured,
    t.affordable_care,
    t.trusted_pros,
  ];
  return (
    <main id="main">
      <section className="np-hero">
        <div className="np-aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="np-hero__grid" aria-hidden="true" />
        <div className="np-wrap np-hero__inner">
          <div className="np-hero__copy">
            <span className="np-pill">
              <i />
              {s.heroEyebrow}
            </span>
            <h1 className="np-hero__title">
              <span>{s.heroTitle}</span>{" "}
              <em className="np-gradient-text">{s.heroAccent}</em>
            </h1>
            <p className="np-hero__lead">{s.heroDescription}</p>
            <div className="np-hero__ctas">
              <Link className="np-btn np-btn--primary np-btn--lg" href="/about">
                {s.heroCta} <Icon name="arrow" size={18} />
              </Link>
              <Link className="np-btn np-btn--ghost np-btn--lg" href="/products">
                {t.explore_products}
              </Link>
            </div>
            <dl className="np-hero__facts">
              {s.established && (
                <div>
                  <dt>{t.established}</dt>
                  <dd>{s.established}</dd>
                </div>
              )}
              <div>
                <dt>{t.our_purpose}</dt>
                <dd>{s.purpose}</dd>
              </div>
            </dl>
          </div>
          <div className="np-orbit" aria-hidden="true">
            <div className="np-orbit__ring np-orbit__ring--1">
              <span className="np-orbit__node">
                <Icon name="pill" size={20} />
              </span>
            </div>
            <div className="np-orbit__ring np-orbit__ring--2">
              <span className="np-orbit__node">
                <Icon name="heart" size={20} />
              </span>
            </div>
            <div className="np-orbit__ring np-orbit__ring--3">
              <span className="np-orbit__node">
                <Icon name="dna" size={20} />
              </span>
            </div>
            <div className="np-orbit__core">
              <Visual
                src={s.heroImage}
                alt=""
                fallback="/illustrations/capsule.svg"
              />
            </div>
            {s.metrics[0] && (
              <div className="np-float np-float--a">
                <strong>{s.metrics[0].value}</strong>
                <span>{s.metrics[0].label}</span>
              </div>
            )}
            <div className="np-float np-float--b">
              <span className="np-float__icon">
                <Icon name="shield" size={20} />
              </span>
              <div>
                <strong>{t.quality_assured}</strong>
                <span>{t.tested_every_stage}</span>
              </div>
            </div>
            {s.metrics[1] && (
              <div className="np-float np-float--c">
                <strong>{s.metrics[1].value}</strong>
                <span>{s.metrics[1].label}</span>
              </div>
            )}
          </div>
        </div>
        <a className="np-hero__scroll" href="#np-glance" aria-label="Scroll to content">
          <span />
        </a>
      </section>
      <div className="np-ticker" aria-hidden="true">
        <div className="np-ticker__track">
          {[...ticker, ...ticker].map((word, i) => (
            <span key={i}>
              {word}
              <Icon name="sparkle" size={18} />
            </span>
          ))}
        </div>
      </div>
      <section className="np-section np-metrics" id="np-glance" aria-label="At a glance">
        <div className="np-wrap np-metrics__grid">
          {s.metrics.map((m, i) => (
            <div
              className="np-metric"
              key={i}
              data-reveal
              style={{ "--d": i * 90 + "ms" } as React.CSSProperties}
            >
              <strong className="np-gradient-text">{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="np-section">
        <div className="np-wrap np-about">
          <div className="np-about__visual" data-reveal>
            <div className="np-about__frame">
              <Visual src={sec.about.imageUrl} alt="Pharmaceutical research" />
            </div>
            <div className="np-about__badge">
              <span className="np-icon-chip np-icon-chip--solid">
                <Icon name="sparkle" size={22} />
              </span>
              <div>
                <strong>
                  {s.established ? t.since + " " + s.established : t.built_on_care}
                </strong>
                <span>{s.purpose}</span>
              </div>
            </div>
          </div>
          <div className="np-about__copy" data-reveal>
            <Eyebrow>{sec.about.eyebrow}</Eyebrow>
            <h2 className="np-h2">{sec.about.title}</h2>
            <p className="np-lead">{sec.about.description}</p>
            <ul className="np-pillars">
              {pillars.map(([icon, key]) => (
                <li key={key}>
                  <span className="np-icon-chip">
                    <Icon name={icon} size={22} />
                  </span>
                  <div>
                    <strong>{t[(key + "_t") as "p1_t"]}</strong>
                    <span>{t[(key + "_d") as "p1_d"]}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="np-link" href="/about">
              {t.discover_story} <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
      {group("products").length > 0 && (
        <section className="np-section np-section--tint">
          <div className="np-wrap">
            <SectionHead section={sec.products} href="/products" more={t.explore_all} />
            <ProductCards items={group("products").slice(0, 8)} />
            <div className="np-more">
              <form action="/products" className="np-quick-search" role="search">
                <Icon name="search" size={18} />
                <label htmlFor="home-product-search" className="np-sr">
                  {t.search_products}
                </label>
                <input
                  id="home-product-search"
                  name="q"
                  maxLength={150}
                  placeholder={t.find_product}
                  autoComplete="off"
                />
                <button aria-label={t.search_products}>
                  <Icon name="arrow" size={16} />
                </button>
              </form>
              <Link className="np-btn np-btn--primary" href="/products">
                {t.view_all_products} ({group("products").length}){" "}
                <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="np-section">
        <div className="np-wrap">
          <SectionHead section={sec.offerings} href="/offerings" more={t.explore_all} />
          <OfferingCards items={group("offerings").slice(0, 4)} />
        </div>
      </section>
      <section className="np-section np-dark">
        <div className="np-aurora np-aurora--soft" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="np-wrap">
          <div className="np-innovate">
            <div className="np-innovate__copy" data-reveal>
              <Eyebrow light>{sec.innovation.eyebrow}</Eyebrow>
              <h2 className="np-h2">{sec.innovation.title}</h2>
              <p className="np-lead">{sec.innovation.description}</p>
              <Link className="np-btn np-btn--light" href="/innovation">
                {t.explore_innovation} <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="np-innovate__visual" data-reveal>
              <Visual
                src={sec.innovation.imageUrl}
                alt="Molecular research"
                fallback="/illustrations/molecule.svg"
              />
            </div>
          </div>
          <ol className="np-steps">
            {steps.map(([icon, key], i) => (
              <li
                key={key}
                data-reveal
                style={{ "--d": i * 100 + "ms" } as React.CSSProperties}
              >
                <span className="np-steps__num">0{i + 1}</span>
                <span className="np-icon-chip np-icon-chip--glass">
                  <Icon name={icon} size={22} />
                </span>
                <strong>{t[(key + "_t") as "s1_t"]}</strong>
                <span>{t[(key + "_d") as "s1_d"]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="np-section">
        <div className="np-wrap">
          <SectionHead section={sec.therapies} href="/therapies" more={t.explore_all} />
          <TherapyExplorer items={therapies} />
        </div>
      </section>
      <section className="np-section np-section--tint">
        <div className="np-wrap np-duo">
          <Link className="np-duo__card np-duo__card--impact" href="/impact" data-reveal>
            <div className="np-duo__media">
              <Visual
                src={sec.impact.imageUrl}
                alt=""
                fallback="/illustrations/globe.svg"
              />
            </div>
            <Eyebrow light>{sec.impact.eyebrow}</Eyebrow>
            <h2>{sec.impact.title}</h2>
            <p>{sec.impact.description}</p>
            <span className="np-link np-link--light">
              {t.our_impact} <Icon name="arrow" size={18} />
            </span>
          </Link>
          <Link
            className="np-duo__card np-duo__card--green"
            href="/sustainability"
            data-reveal
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <span className="np-duo__leaf" aria-hidden="true">
              <Icon name="leaf" size={150} />
            </span>
            <Eyebrow light>{sec.sustainability.eyebrow}</Eyebrow>
            <h2>{sec.sustainability.title}</h2>
            <p>{sec.sustainability.description}</p>
            <span className="np-link np-link--light">
              {t.sustainability} <Icon name="arrow" size={18} />
            </span>
          </Link>
        </div>
      </section>
      <section className="np-section">
        <div className="np-wrap">
          <div className="np-careers" data-reveal>
            <div className="np-careers__copy">
              <Eyebrow>{sec.careers.eyebrow}</Eyebrow>
              <h2 className="np-h2">{sec.careers.title}</h2>
              <p className="np-lead">{sec.careers.description}</p>
              <Link className="np-btn np-btn--primary" href="/careers">
                {t.explore_careers} <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="np-careers__art" aria-hidden="true">
              <span className="np-careers__bubble np-careers__bubble--1">
                <Icon name="users" size={30} />
              </span>
              <span className="np-careers__bubble np-careers__bubble--2">
                <Icon name="flask" size={26} />
              </span>
              <span className="np-careers__bubble np-careers__bubble--3">
                <Icon name="sparkle" size={24} />
              </span>
              <strong>
                {t.grow_with}
                <br />
                <em>{t.purpose_word}</em>
              </strong>
            </div>
          </div>
        </div>
      </section>
      {group("news").length > 0 && (
        <section className="np-section np-section--tint">
          <div className="np-wrap">
            <SectionHead section={sec.news} href="/news" more={t.explore_all} />
            <StoryCards
              items={group("news").slice(0, 3)}
              readLabel={t.read_story}
              fallbackCategory={t.perspective}
            />
          </div>
        </section>
      )}
      <section className="np-section np-section--cta">
        <div className="np-wrap">
          <div className="np-cta" data-reveal>
            <div className="np-aurora np-aurora--soft" aria-hidden="true">
              <span />
              <span />
            </div>
            <Eyebrow light>{sec.contact.eyebrow}</Eyebrow>
            <h2>{sec.contact.title}</h2>
            <p>{sec.contact.description}</p>
            <div className="np-cta__actions">
              <Link className="np-btn np-btn--light np-btn--lg" href="/contact">
                {t.get_in_touch} <Icon name="arrow" size={18} />
              </Link>
              {s.contactPhone && (
                <a
                  className="np-btn np-btn--ghost np-btn--lg"
                  href={"tel:" + s.contactPhone.replace(/\s/g, "")}
                >
                  <Icon name="phone" size={18} /> <bdi>{s.contactPhone}</bdi>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
