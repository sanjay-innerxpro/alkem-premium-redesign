import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem } from "@/lib/content";
import { collections, type Collection } from "@/lib/types";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
type Props = { params: Promise<{ section: string; slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { section, slug } = await params;
  if (!collections.includes(section as Collection) || section === "pages")
    return {};
  const x = await getItem(section as Collection, slug);
  return x ? { title: x.title, description: x.summary } : {};
}
export default async function Detail({ params }: Props) {
  const { section, slug } = await params;
  if (!collections.includes(section as Collection) || section === "pages")
    notFound();
  const x = await getItem(section as Collection, slug);
  if (!x) notFound();
  return (
    <main id="main">
      <div className="page-banner">
        <div className="page-container">
          <Link className="breadcrumb" href={"/" + section}>
            ← Back to {section}
          </Link>
          <span className="section-label">{x.category || section}</span>
          <h1>{x.title}</h1>
          <p>{x.summary}</p>
          {section === "careers" && (
            <p>{[x.location, x.employmentType].filter(Boolean).join(" · ")}</p>
          )}
        </div>
      </div>
      <article className="page-container article-page">
        {x.imageUrl && (
          <Visual src={x.imageUrl} alt={x.title} className="detail-image" />
        )}
        <div className="prose">
          {x.body.split(/\n\s*\n/).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        {section === "careers" ? (
          <section className="apply-section">
            <h2>Interested in this role?</h2>
            <p>
              Send a career enquiry with a link to your professional profile.
            </p>
            <ContactForm jobId={x.id} jobTitle={x.title} />
          </section>
        ) : (
          <Link className="button button-primary" href="/contact">
            Start a conversation <span className="round-arrow">↗</span>
          </Link>
        )}
      </article>
    </main>
  );
}
