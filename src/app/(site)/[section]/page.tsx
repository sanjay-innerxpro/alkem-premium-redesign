import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getSettings, getItem } from "@/lib/content";
import { collections, type Collection } from "@/lib/types";
import { OfferingCards, StoryCards } from "@/components/cards";
import { TherapyExplorer } from "@/components/therapy-explorer";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
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
export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { section } = await params;
  const s = await getSettings();
  if (section === "contact")
    return (
      <main id="main">
        <div className="page-banner">
          <div className="page-container">
            <span className="section-label">{s.sections.contact.eyebrow}</span>
            <h1>{s.sections.contact.title}</h1>
            <p>{s.sections.contact.description}</p>
          </div>
        </div>
        <section className="section">
          <div className="page-container contact-layout">
            <aside>
              <span className="section-kicker">START A CONVERSATION</span>
              <h2>
                A little connection.
                <br />A world of possibility.
              </h2>
              {s.contactEmail && (
                <p>
                  <a href={"mailto:" + s.contactEmail}>{s.contactEmail}</a>
                </p>
              )}
              {s.contactPhone && (
                <p>
                  <a href={"tel:" + s.contactPhone}>{s.contactPhone}</a>
                </p>
              )}
              {s.contactAddress && <p className="prose">{s.contactAddress}</p>}
              <div className="notice">
                This is an independent design concept. For official company
                enquiries, visit{" "}
                <a
                  href="https://www.alkemlabs.com/contact-us/key-contacts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Alkem’s official contact directory ↗
                </a>
                .
              </div>
            </aside>
            <ContactForm />
          </div>
        </section>
      </main>
    );
  if (section === "privacy")
    return (
      <main id="main" className="page-container article-page">
        <span className="section-label">YOUR PRIVACY</span>
        <h1>Clear about your information.</h1>
        <div className="prose">
          <p>
            This independent design concept stores the name, email, subject and
            message you submit in its enquiry database. Authorised
            administrators can read and delete these records to handle your
            enquiry. Messages are not emailed automatically.
          </p>
          <p>
            Administrator sign-in uses a necessary session cookie, valid for
            eight hours. No analytics or advertising cookies are included.
            Temporary hashed rate-limit records help prevent abuse.
          </p>
          <p>
            Please avoid sending health details, identity documents or other
            sensitive information. Use the contact form to request deletion of a
            previous enquiry, providing the email address used. The site
            operator must establish retention periods, a verified privacy
            contact and any additional legal disclosures before accepting public
            enquiries.
          </p>
        </div>
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
        <div className="page-banner">
          <div className="page-container">
            <span className="section-label">{head.eyebrow}</span>
            <h1>{head.title}</h1>
            <p>{head.description}</p>
          </div>
        </div>
        <section className="section">
          <div className="page-container">
            <form className="search-form" role="search">
              <label htmlFor="content-search">Search {section}</label>
              <div>
                <input
                  id="content-search"
                  name="q"
                  defaultValue={q}
                  maxLength={150}
                  placeholder={"Find " + section + "…"}
                />
                <button className="small-button">Search ↗</button>
                {q && <Link href={"/" + section}>Clear</Link>}
              </div>
            </form>
            {items.length === 0 ? (
              <div className="empty-state">
                <h2>
                  {q ? "No matching results." : "More possibilities ahead."}
                </h2>
                <p>
                  {q
                    ? "Try a different search."
                    : section === "careers"
                      ? "There are no published vacancies at the moment. Please check back for new opportunities."
                      : "Content will appear here when it is published."}
                </p>
              </div>
            ) : section === "offerings" ? (
              <OfferingCards items={items} />
            ) : section === "therapies" ? (
              <TherapyExplorer items={items} />
            ) : section === "news" ? (
              <StoryCards items={items} />
            ) : (
              <div className="job-list">
                {items.map((x) => (
                  <Link
                    className="job-card"
                    href={"/careers/" + x.slug}
                    key={x.id}
                  >
                    <div>
                      <span className="section-kicker">
                        {x.category || "OPPORTUNITY"}
                      </span>
                      <h2>{x.title}</h2>
                      <p>
                        {[x.location, x.employmentType]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="round-arrow">↗</span>
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
      <div className="page-banner">
        <div className="page-container">
          <span className="section-label">{page.category || "OUR WORLD"}</span>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
        </div>
      </div>
      <section className="section">
        <div className="page-container article-layout">
          {page.imageUrl && (
            <div className="article-visual">
              <Visual src={page.imageUrl} alt={page.title} />
            </div>
          )}
          <div className="prose">
            <h2>{page.title}</h2>
            {page.body.split(/\n\s*\n/).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            <Link className="inline-link" href="/contact">
              Let’s connect <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
