import Link from "next/link";
import { getContent, getSettings } from "@/lib/content";
import { Visual } from "@/components/visual";
import { OfferingCards, SectionHead, StoryCards } from "@/components/cards";
import { TherapyExplorer } from "@/components/therapy-explorer";
export async function generateMetadata() {
  const s = await getSettings();
  return { title: { absolute: s.seoTitle }, description: s.seoDescription };
}
export default async function Home() {
  const [s, items] = await Promise.all([getSettings(), getContent()]);
  const sec = s.sections;
  const group = (name: string) => items.filter((x) => x.collection === name);
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-grain" />
        <div className="hero-container page-container">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {s.heroEyebrow}
            </div>
            <h1>
              {s.heroTitle}
              <br />
              <span className="hero-text-gradient">{s.heroAccent}</span>
            </h1>
            <p className="hero-intro">{s.heroDescription}</p>
            <div className="hero-ctas">
              <Link className="button button-primary" href="/about">
                {s.heroCta}
                <span className="round-arrow">↗</span>
              </Link>
              <Link className="text-button" href="/innovation">
                <span className="play-circle">↗</span>Explore our capabilities
              </Link>
            </div>
            <div className="hero-meta">
              <span className="hero-meta-rule" />
              <div>
                <span className="tiny-label">ESTABLISHED</span>
                <strong>{s.established}</strong>
              </div>
              <div className="hero-meta-divider" />
              <div>
                <span className="tiny-label">OUR PURPOSE</span>
                <strong>{s.purpose}</strong>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <div className="halo halo-one" />
            <div className="halo halo-two" />
            <div className="hero-mesh" />
            <Visual
              src={s.heroImage}
              alt="An abstract illustration of medical science"
              className="orbit-graphic"
              fallback="/science.svg"
            />
            <div className="float-tag tag-top">
              <span className="tag-icon">✳</span>
              <div>
                <strong>Purpose-led</strong>
                <small>Better everyday health</small>
              </div>
            </div>
            <div className="float-tag tag-bottom">
              <div className="live-icon">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div>
                <strong>{s.purpose}</strong>
                <small>Science. Care. Possibility.</small>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-line" />
          <span>↓</span>
        </div>
      </section>
      <section className="metrics" aria-label="At a glance">
        <div className="metrics-shell page-container">
          <div className="metrics-intro">
            <span className="section-kicker">OUR REACH</span>
            <p>
              Big ambition.
              <br />
              Real-world impact.
            </p>
          </div>
          {s.metrics.map((m, i) => (
            <div className="metric" key={i}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section" id="about">
        <div className="page-container about-grid">
          <div className="about-visual">
            <div className="about-picture">
              <Visual
                src={sec.about.imageUrl}
                alt="Scientific research and discovery"
              />
            </div>
            <div className="about-since">
              <span>EST.</span>
              <strong>{s.established}</strong>
              <span>A LEGACY OF CARE</span>
            </div>
          </div>
          <div className="about-copy">
            <div className="section-label">
              <span className="label-line" />
              {sec.about.eyebrow}
            </div>
            <h2 className="section-title">{sec.about.title}</h2>
            <p className="section-lede">{sec.about.description}</p>
            <div className="about-feature-row">
              <span className="about-feature-icon">✓</span>
              <div>
                <strong>Quality at every step</strong>
                <span>Science with people at its heart.</span>
              </div>
            </div>
            <Link className="inline-link" href="/about">
              Discover our story <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section offerings-section">
        <div className="page-container">
          <SectionHead section={sec.offerings} href="/offerings" />
          <OfferingCards items={group("offerings").slice(0, 4)} />
        </div>
      </section>
      <section className="science-section">
        <div className="science-pattern" />
        <div className="page-container science-grid">
          <div className="science-copy">
            <div className="section-label section-label-light">
              <span className="label-line" />
              {sec.innovation.eyebrow}
            </div>
            <h2 className="section-title light">{sec.innovation.title}</h2>
            <p>{sec.innovation.description}</p>
            <Link className="button button-white" href="/innovation">
              Explore our capabilities <span className="round-arrow">↗</span>
            </Link>
          </div>
          <div className="science-visual">
            <div className="science-image">
              <Visual src={sec.innovation.imageUrl} alt="Research laboratory" />
            </div>
            <div className="science-caption">
              <span>THE FUTURE OF HEALTHCARE</span>
              <strong>BUILT ON DISCOVERY.</strong>
              <span className="science-mini-star">✳</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="page-container">
          <SectionHead section={sec.therapies} />
          <TherapyExplorer items={group("therapies")} />
          <div className="therapy-bottom">
            <span>Explore our approach to care.</span>
            <Link className="inline-link" href="/therapies">
              View full portfolio <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section footprint-section">
        <div className="page-container footprint-layout">
          <div className="footprint-text">
            <div className="section-label">
              <span className="label-line" />
              {sec.impact.eyebrow}
            </div>
            <h2 className="section-title">{sec.impact.title}</h2>
            <p>{sec.impact.description}</p>
            <Link className="inline-link" href="/impact">
              Explore our global presence <span>↗</span>
            </Link>
          </div>
          <div className="footprint-art">
            <div className="map-circle ring1" />
            <div className="map-circle ring2" />
            <Visual
              src={sec.impact.imageUrl}
              alt="An illustrated global healthcare network"
              fallback="/world.svg"
              className="world-art"
            />
          </div>
        </div>
      </section>
      <section className="responsibility-section">
        <div className="page-container">
          <div className="responsibility-card">
            <div className="responsibility-decor">
              <span />
              <span />
              <span />
            </div>
            <div className="responsibility-content">
              <div className="section-label section-label-light">
                {sec.sustainability.eyebrow}
              </div>
              <h2>{sec.sustainability.title}</h2>
              <p>{sec.sustainability.description}</p>
              <Link
                className="button button-outline-white"
                href="/sustainability"
              >
                Explore sustainability <span className="round-arrow">↗</span>
              </Link>
            </div>
            <div className="responsibility-icon" aria-hidden="true">
              <svg viewBox="0 0 230 230">
                <path
                  d="M114 200V60m0 92c-52 0-76-44-75-84 47 1 76 37 75 84Zm0-25c0-62 38-96 80-101-1 55-26 101-80 101Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section className="section careers-section">
        <div className="page-container careers-layout">
          <div className="careers-copy">
            <div className="section-label">
              <span className="label-line" />
              {sec.careers.eyebrow}
            </div>
            <h2 className="section-title">{sec.careers.title}</h2>
            <p>{sec.careers.description}</p>
            <Link className="button button-primary" href="/careers">
              Explore careers <span className="round-arrow">↗</span>
            </Link>
          </div>
          <div className="careers-poster">
            <div className="careers-poster-inner">
              <span>PEOPLE FIRST</span>
              <strong>
                BE PART OF
                <br />
                SOMETHING
                <br />
                <em>MEANINGFUL.</em>
              </strong>
              <span className="poster-footer">
                DISCOVER YOUR POTENTIAL <span>✳</span>
              </span>
            </div>
          </div>
        </div>
      </section>
      {group("news").length > 0 && (
        <section className="section offerings-section">
          <div className="page-container">
            <SectionHead section={sec.news} href="/news" />
            <StoryCards items={group("news").slice(0, 3)} />
          </div>
        </section>
      )}
      <section className="contact-section">
        <div className="page-container contact-inner">
          <div>
            <div className="section-label section-label-light">
              {sec.contact.eyebrow}
            </div>
            <h2>{sec.contact.title}</h2>
          </div>
          <div className="contact-actions">
            <Link
              className="contact-round-arrow"
              href="/contact"
              aria-label="Get in touch"
            >
              ↗
            </Link>
            <span>Start a conversation</span>
          </div>
        </div>
      </section>
    </main>
  );
}
