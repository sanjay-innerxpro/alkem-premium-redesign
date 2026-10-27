import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getSettings, getItem } from "@/lib/content";
import { collections, type Collection } from "@/lib/types";
import { OfferingCards, StoryCards } from "@/components/cards";
import { TherapyExplorer } from "@/components/therapy-explorer";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
import { Banner } from "@/components/banner";
import { Icon } from "@/components/icons";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const page = await getItem("pages", section);
  return {
    title: page?.title || section.charAt(0).toUpperCase() + section.slice(1),
  };
}
const labels: Record<string, string> = {
  offerings: "Offerings",
  therapies: "Therapy areas",
  news: "News & insights",
  careers: "Careers",
};
export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { section } = await params;
  const s = await getSettings();
  if (section === "contact") {
    const channels = [
      s.contactEmail && ["mail", "Email us", s.contactEmail, "mailto:" + s.contactEmail],
      s.contactPhone && [
        "phone",
        "Call us",
        s.contactPhone,
        "tel:" + s.contactPhone.replace(/\s/g, ""),
      ],
      s.contactAddress && ["pin", "Visit us", s.contactAddress, ""],
    ].filter(Boolean) as string[][];
    return (
      <main id="main">
        <Banner
          label="Contact"
          title={s.sections.contact.title}
          text={s.sections.contact.description}
        />
        <section className="np-section">
          <div className="np-wrap np-contact">
            <aside className="np-contact__info" data-reveal>
              <h2 className="np-h3">
                Let’s start a <em className="np-gradient-text">conversation.</em>
              </h2>
              <p className="np-lead">
                Whether you are a healthcare professional, distributor, partner
                or job seeker, our team is here to help.
              </p>
              <div className="np-channels">
                {channels.map(([icon, label, value, href]) => {
                  const inner = (
                    <>
                      <span className="np-icon-chip">
                        <Icon name={icon} size={22} />
                      </span>
                      <div>
                        <small>{label}</small>
                        <strong>{value}</strong>
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
                      <small>Write to us</small>
                      <strong>Use the form and our team will respond.</strong>
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
          label="Privacy"
          title="Clear about your information."
          text={"How " + s.brand + " " + s.tagline + " handles what you share with us."}
        />
        <section className="np-section">
          <div className="np-wrap np-article">
            <div className="np-prose">
              <p>
                When you contact us through this website, we store the name,
                email address, subject and message you submit so that our team
                can respond. Authorised staff can read and delete these records.
                Messages are not shared with third parties or sent to marketing
                lists.
              </p>
              <p>
                Staff sign-in uses a necessary session cookie, valid for eight
                hours. This website does not use analytics or advertising
                cookies. Temporary hashed records help prevent abuse of our
                forms.
              </p>
              <p>
                Please avoid sending health details, identity documents or other
                sensitive information. To ask us to delete a previous enquiry,
                use the contact form and include the email address you used.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  if (collections.includes(section as Collection) && section !== "pages") {
    const collection = section as Collection;
    const q = ((await searchParams).q || "").trim().slice(0, 150);
    const all = await getContent(collection);
    const items = all.filter((x) =>
      (x.title + " " + x.summary + " " + x.location)
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
    const head =
      s.sections[section as "offerings" | "therapies" | "news" | "careers"];
    return (
      <main id="main">
        <Banner label={labels[section]} title={head.title} text={head.description} />
        <section className="np-section">
          <div className="np-wrap">
            <form className="np-search" role="search">
              <label htmlFor="content-search" className="np-sr">
                Search {labels[section].toLowerCase()}
              </label>
              <Icon name="search" size={20} />
              <input
                id="content-search"
                name="q"
                defaultValue={q}
                maxLength={150}
                placeholder={"Search " + labels[section].toLowerCase() + "…"}
              />
              {q && (
                <Link className="np-search__clear" href={"/" + section}>
                  Clear
                </Link>
              )}
              <button className="np-btn np-btn--primary np-btn--sm">Search</button>
            </form>
            {items.length === 0 ? (
              <div className="np-empty">
                <span className="np-icon-chip">
                  <Icon name={q ? "search" : "sparkle"} size={24} />
                </span>
                <h2>{q ? "No matching results." : "More is on the way."}</h2>
                <p>
                  {q
                    ? "Try a different search term."
                    : section === "careers"
                      ? "There are no open positions right now. Please check back soon, or send us your profile through the contact page."
                      : "New content will appear here soon."}
                </p>
                {section === "careers" && !q && (
                  <Link className="np-btn np-btn--primary" href="/contact">
                    Contact us <Icon name="arrow" size={18} />
                  </Link>
                )}
              </div>
            ) : section === "offerings" ? (
              <OfferingCards items={items} />
            ) : section === "therapies" ? (
              <TherapyExplorer items={items} />
            ) : section === "news" ? (
              <StoryCards items={items} />
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
                      <span className="np-tag">{x.category || "Opportunity"}</span>
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
  const page = await getItem("pages", section);
  if (!page) notFound();
  return (
    <main id="main">
      <Banner label={page.category || "Our world"} title={page.title} text={page.summary} />
      <section className="np-section">
        <div className={"np-wrap np-article" + (page.imageUrl ? " np-article--media" : "")}>
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
              Talk to our team <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
