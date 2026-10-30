import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, siteItem, siteSettings } from "@/lib/i18n-server";
import type { Dict } from "@/lib/i18n";
import { collections, type Collection } from "@/lib/types";
import { Visual } from "@/components/visual";
import { ContactForm } from "@/components/contact-form";
import { Banner } from "@/components/banner";
import { Icon, iconFor } from "@/components/icons";
type Props = { params: Promise<{ section: string; slug: string }> };
const labelKeys: Record<string, keyof Dict> = {
  products: "lbl_products",
  offerings: "lbl_offerings",
  therapies: "lbl_therapies",
  news: "lbl_news",
  careers: "lbl_careers",
};
export async function generateMetadata({ params }: Props) {
  const { section, slug } = await params;
  if (!collections.includes(section as Collection) || section === "pages")
    return {};
  const x = await siteItem(section as Collection, slug);
  return x ? { title: x.title, description: x.summary } : {};
}
export default async function Detail({ params }: Props) {
  const { section, slug } = await params;
  if (!collections.includes(section as Collection) || section === "pages")
    notFound();
  const [x, t, s] = await Promise.all([
    siteItem(section as Collection, slug),
    getDict(),
    siteSettings(),
  ]);
  if (!x) notFound();
  const label = t[labelKeys[section]];
  return (
    <main id="main">
      <Banner
        label={x.category || label}
        home={t.home}
        title={x.title}
        text={x.summary}
        crumbs={[["/" + section, label]]}
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
              <Visual
                src={x.imageUrl}
                alt={x.title}
                className="np-detail__image"
              />
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
                  [t.composition, x.composition],
                  [t.dosage_form, x.dosageForm],
                  [t.pack_size, x.packSize],
                  [t.price, x.price],
                  [t.moq, x.moq],
                  [t.therapy_area, x.category],
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
            {section === "products" && s.productsNote && (
              <p className="np-note">{s.productsNote}</p>
            )}
            {section === "products" && (
              <section className="np-card np-apply">
                <h2 className="np-h3">{t.enquire_product}</h2>
                <p>{t.enquire_text}</p>
                <ContactForm subject={t.product_enquiry + x.title} />
              </section>
            )}
            {section === "careers" && (
              <section className="np-card np-apply">
                <h2 className="np-h3">{t.interested_role}</h2>
                <p>{t.role_text}</p>
                <ContactForm jobId={x.id} jobTitle={x.title} />
              </section>
            )}
          </article>
          <aside className="np-detail__aside" data-reveal>
            <div className="np-card np-card--dark">
              <span className="np-icon-chip np-icon-chip--glass">
                <Icon name="sparkle" size={22} />
              </span>
              <h2>{t.have_question}</h2>
              <p>{t.question_text}</p>
              <Link className="np-btn np-btn--light" href="/contact">
                {t.contact_us} <Icon name="arrow" size={18} />
              </Link>
            </div>
            <Link className="np-link" href={"/" + section}>
              <Icon name="arrow" size={18} className="np-flip" /> {t.all_prefix}{" "}
              {label}
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
