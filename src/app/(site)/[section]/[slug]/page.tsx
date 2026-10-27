import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem } from "@/lib/content";
import { collections, type Collection } from "@/lib/types";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
import { Banner } from "@/components/banner";
import { Icon, iconFor } from "@/components/icons";
type Props = { params: Promise<{ section: string; slug: string }> };
const labels: Record<string, string> = {
  products: "Products",
  offerings: "Offerings",
  therapies: "Therapy areas",
  news: "News & insights",
  careers: "Careers",
};
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
      <Banner
        label={x.category || labels[section]}
        title={x.title}
        text={x.summary}
        crumbs={[["/" + section, labels[section]]]}
      >
        {section === "careers" && (x.location || x.employmentType) && (
          <p className="np-banner__meta">
            {[x.location, x.employmentType].filter(Boolean).join(" · ")}
          </p>
        )}
      </Banner>
      <section className="np-section">
        <div className="np-wrap np-detail">
          <article className="np-detail__main" data-reveal>
            {x.imageUrl ? (
              <Visual src={x.imageUrl} alt={x.title} className="np-detail__image" />
            ) : (
              section !== "careers" &&
              section !== "products" && (
                <div className="np-detail__hero" aria-hidden="true">
                  <Icon name={iconFor(x.slug)} size={72} />
                </div>
              )
            )}
            {section === "products" && (
              <dl className="np-specs">
                {[
                  ["Composition", x.composition],
                  ["Dosage form", x.dosageForm],
                  ["Pack size", x.packSize],
                  ["Therapy area", x.category],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
            )}
            <div className="np-prose">
              {x.body.split(/\n\s*\n/).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            {section === "products" && (
              <section className="np-card np-apply">
                <h2 className="np-h3">Enquire about this product</h2>
                <p>For availability, pricing or trade enquiries, send us a message.</p>
                <ContactForm subject={"Product enquiry: " + x.title} />
              </section>
            )}
            {section === "careers" && (
              <section className="np-card np-apply">
                <h2 className="np-h3">Interested in this role?</h2>
                <p>Send us a note with a link to your professional profile.</p>
                <ContactForm jobId={x.id} jobTitle={x.title} />
              </section>
            )}
          </article>
          <aside className="np-detail__aside" data-reveal>
            <div className="np-card np-card--dark">
              <span className="np-icon-chip np-icon-chip--glass">
                <Icon name="sparkle" size={22} />
              </span>
              <h2>Have a question?</h2>
              <p>Our team is happy to help with product, partnership or career enquiries.</p>
              <Link className="np-btn np-btn--light" href="/contact">
                Contact us <Icon name="arrow" size={18} />
              </Link>
            </div>
            <Link className="np-link" href={"/" + section}>
              <Icon name="arrow" size={18} className="np-flip" /> All {labels[section].toLowerCase()}
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
