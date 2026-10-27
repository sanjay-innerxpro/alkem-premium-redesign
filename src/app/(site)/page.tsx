import Link from "next/link";
import { getContent, getSettings } from "@/lib/content";
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
  const s = await getSettings();
  return { title: { absolute: s.seoTitle }, description: s.seoDescription };
}
const pillars = [
  ["shield", "Quality without compromise", "Every batch checked against strict quality standards."],
  ["users", "Patients at the centre", "Medicines shaped around real needs and real lives."],
  ["award", "Integrity in everything", "Ethical practice and transparency with every partner."],
];
const steps = [
  ["flask", "Research", "Understanding patient needs and the science behind them."],
  ["dna", "Develop", "Formulating safe, effective and stable medicines."],
  ["factory", "Manufacture", "Producing at scale under rigorous quality control."],
  ["truck", "Deliver", "Reaching pharmacies, hospitals and doctors reliably."],
];
export default async function Home() {
  const [s, items] = await Promise.all([getSettings(), getContent()]);
  const sec = s.sections;
  const group = (name: string) => items.filter((x) => x.collection === name);
  const therapies = group("therapies");
  const ticker = [
    ...therapies.map((x) => x.title),
    "Quality assured",
    "Affordable care",
    "Trusted by professionals",
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
                Explore products
              </Link>
            </div>
            <dl className="np-hero__facts">
              {s.established && (
                <div>
                  <dt>Established</dt>
                  <dd>{s.established}</dd>
                </div>
              )}
              <div>
                <dt>Our purpose</dt>
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
                <strong>Quality assured</strong>
                <span>Tested at every stage</span>
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
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>
              {t}
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
                <strong>{s.established ? "Since " + s.established : "Built on care"}</strong>
                <span>{s.purpose}</span>
              </div>
            </div>
          </div>
          <div className="np-about__copy" data-reveal>
            <Eyebrow>{sec.about.eyebrow}</Eyebrow>
            <h2 className="np-h2">{sec.about.title}</h2>
            <p className="np-lead">{sec.about.description}</p>
            <ul className="np-pillars">
              {pillars.map(([icon, title, text]) => (
                <li key={title}>
                  <span className="np-icon-chip">
                    <Icon name={icon} size={22} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="np-link" href="/about">
              Discover our story <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
      {group("products").length > 0 && (
        <section className="np-section np-section--tint">
          <div className="np-wrap">
            <SectionHead section={sec.products} href="/products" />
            <ProductCards items={group("products").slice(0, 8)} />
            <div className="np-more">
              <Link className="np-btn np-btn--primary" href="/products">
                View all {group("products").length} products{" "}
                <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="np-section">
        <div className="np-wrap">
          <SectionHead section={sec.offerings} href="/offerings" />
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
                Explore innovation <Icon name="arrow" size={18} />
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
            {steps.map(([icon, title, text], i) => (
              <li
                key={title}
                data-reveal
                style={{ "--d": i * 100 + "ms" } as React.CSSProperties}
              >
                <span className="np-steps__num">0{i + 1}</span>
                <span className="np-icon-chip np-icon-chip--glass">
                  <Icon name={icon} size={22} />
                </span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="np-section">
        <div className="np-wrap">
          <SectionHead section={sec.therapies} href="/therapies" />
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
              Our impact <Icon name="arrow" size={18} />
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
              Sustainability <Icon name="arrow" size={18} />
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
                Explore careers <Icon name="arrow" size={18} />
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
                Grow with
                <br />
                <em>purpose.</em>
              </strong>
            </div>
          </div>
        </div>
      </section>
      {group("news").length > 0 && (
        <section className="np-section np-section--tint">
          <div className="np-wrap">
            <SectionHead section={sec.news} href="/news" />
            <StoryCards items={group("news").slice(0, 3)} />
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
                Get in touch <Icon name="arrow" size={18} />
              </Link>
              {s.contactPhone && (
                <a
                  className="np-btn np-btn--ghost np-btn--lg"
                  href={"tel:" + s.contactPhone.replace(/\s/g, "")}
                >
                  <Icon name="phone" size={18} /> {s.contactPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
