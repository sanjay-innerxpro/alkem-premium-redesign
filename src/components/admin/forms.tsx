"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveContent,
  deleteContent,
  saveSettings,
  updateEnquiry,
} from "@/app/admin/actions";
import { socialNetworks } from "@/lib/types";
import type { Content, Settings, Enquiry } from "@/lib/types";
const initial = {};
const dosageForms = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Injection",
  "Cream",
  "Ointment",
  "Gel",
  "Drops",
  "Sachet",
];
const socialLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  youtube: "YouTube",
};
export function Field({
  label,
  name,
  value = "",
  area = false,
  required = false,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  value?: string | number;
  area?: boolean;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="field">
      {label}
      {area ? (
        <textarea
          name={name}
          defaultValue={value}
          rows={name.endsWith("body") ? 12 : 3}
          required={required}
        />
      ) : (
        <input
          name={name}
          defaultValue={value}
          type={type}
          required={required}
        />
      )}{" "}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Result({ state }: { state: { error?: string; success?: string } }) {
  return (
    <div role="status">
      {state.error && <p className="error-message">{state.error}</p>}
      {state.success && <p className="success-message">{state.success}</p>}
    </div>
  );
}
export function Editor({ item }: { item: Content }) {
  const [state, action, pending] = useActionState(saveContent, initial);
  const [delState, delAction, deleting] = useActionState(
    deleteContent,
    initial,
  );
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <form action={action} className="editor-form">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="collection" value={item.collection} />
        <div className="editor-columns">
          <section className="studio-card">
            <div className="card-heading">
              <span>01</span>
              <h2>The story</h2>
            </div>
            <Field label="Title" name="title" value={item.title} required />
            <Field
              label="URL slug"
              name="slug"
              value={item.slug}
              required
              hint="Lowercase words separated by hyphens. Changing this changes the public URL."
            />
            <Field
              label="Short description"
              name="summary"
              value={item.summary}
              area
            />
            <Field
              label="Full content"
              name="body"
              value={item.body}
              area
              hint="Plain text. Separate paragraphs with a blank line; HTML is never executed."
            />
          </section>
          <aside className="studio-card editor-options">
            <div className="card-heading">
              <span>02</span>
              <h2>Details & publishing</h2>
            </div>
            <Field
              label={
                item.collection === "products"
                  ? "Therapy area"
                  : "Category / eyebrow"
              }
              name="category"
              value={item.category}
              hint={
                item.collection === "products"
                  ? "Used for the filter on the products page, e.g. Cardiology."
                  : undefined
              }
            />
            {item.collection === "products" ? (
              <>
                <Field
                  label="Composition"
                  name="composition"
                  value={item.composition}
                  area
                />
                <div className="form-row">
                  <label className="field">
                    Dosage form
                    <select name="dosageForm" defaultValue={item.dosageForm}>
                      <option value="">Select form</option>
                      {dosageForms.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Pack size"
                    name="packSize"
                    value={item.packSize}
                  />
                </div>
                <div className="form-row">
                  <Field
                    label="Price (shown publicly, e.g. ₹70 per box)"
                    name="price"
                    value={item.price}
                  />
                  <Field
                    label="Minimum order (MOQ, e.g. 300 boxes)"
                    name="moq"
                    value={item.moq}
                  />
                </div>
              </>
            ) : (
              <>
                <input name="composition" type="hidden" value="" />
                <input name="dosageForm" type="hidden" value="" />
                <input name="packSize" type="hidden" value="" />
                <input name="price" type="hidden" value="" />
                <input name="moq" type="hidden" value="" />
              </>
            )}
            <Field
              label={
                item.collection === "products"
                  ? "Product image URL (optional)"
                  : "Image URL"
              }
              name="imageUrl"
              value={item.imageUrl}
              hint="HTTPS image URL or a site path such as /illustrations/lab.svg"
            />
            <Field
              label="Display order"
              name="sortOrder"
              value={item.sortOrder}
              type="number"
            />
            {item.collection === "careers" ? (
              <>
                <Field label="Location" name="location" value={item.location} />
                <label className="field">
                  Employment type
                  <select
                    name="employmentType"
                    defaultValue={item.employmentType}
                  >
                    <option value="">Select type</option>
                    {["Full-time", "Part-time", "Contract", "Internship"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </select>
                </label>
              </>
            ) : (
              <>
                <input name="location" type="hidden" value="" />
                <input name="employmentType" type="hidden" value="" />
              </>
            )}
            <label className="toggle-field">
              <input
                type="checkbox"
                name="published"
                defaultChecked={item.published}
              />
              <span>
                <strong>Published</strong>
                <small>Visible to website visitors</small>
              </span>
            </label>
            <Result state={state} />
            <button className="studio-button" disabled={pending}>
              {pending ? "Saving…" : "Save content ↗"}
            </button>
            <Link
              className="studio-secondary"
              href={"/admin/content?collection=" + item.collection}
            >
              Cancel
            </Link>
          </aside>
        </div>
      </form>
      {item.id && (
        <div className="danger-zone">
          <button className="danger-link" onClick={() => setConfirm(!confirm)}>
            Delete this item
          </button>
          {confirm && (
            <form action={delAction}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="collection" value={item.collection} />
              <p>Delete “{item.title}” permanently? This cannot be undone.</p>
              <button className="danger-button" disabled={deleting}>
                Confirm permanent deletion
              </button>
              <Result state={delState} />
            </form>
          )}
        </div>
      )}
    </>
  );
}
export function SettingsForm({ settings: s }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  const fields = (names: [string, string, boolean?][]) =>
    names.map(([key, label, area]) => (
      <Field
        key={key}
        name={key}
        label={label}
        value={String(s[key as keyof Settings])}
        area={area}
      />
    ));
  return (
    <form action={action} className="settings-form">
      <section className="studio-card">
        <div className="card-heading">
          <span>01</span>
          <h2>Brand & search</h2>
        </div>
        <div className="form-row">
          {fields([
            ["brand", "Brand name"],
            ["tagline", "Brand tagline"],
          ])}
        </div>
        {fields([
          ["logoUrl", "Logo image URL (symbol, shown on a white tile)"],
          ["productsNote", "Products note (catalogue and product pages)", true],
        ])}
        <p className="form-note">
          The logo and icons follow the brand name; the Android app picks it up
          on its next build. Write {"{brand}"} in any text or page to show the
          current brand name there.
        </p>
        {fields([
          ["seoTitle", "Homepage SEO title"],
          ["seoDescription", "Search description", true],
          ["footerText", "Footer description", true],
        ])}
      </section>
      <section className="studio-card">
        <div className="card-heading">
          <span>02</span>
          <h2>Homepage hero</h2>
        </div>
        {fields([
          ["heroEyebrow", "Eyebrow"],
          ["heroTitle", "Main headline"],
          ["heroAccent", "Accent headline"],
          ["heroDescription", "Introduction", true],
          ["heroCta", "Button label"],
          ["heroImage", "Hero image URL"],
        ])}
        <div className="form-row">
          {fields([
            ["established", "Established year"],
            ["purpose", "Purpose"],
          ])}
        </div>
      </section>
      <section className="studio-card">
        <div className="card-heading">
          <span>03</span>
          <h2>At a glance</h2>
        </div>
        <p className="studio-muted">
          Verify company figures before official publication.
        </p>
        {s.metrics.map((m, i) => (
          <div className="form-row" key={i}>
            <Field
              label={"Metric " + (i + 1)}
              name={"metrics." + i + ".value"}
              value={m.value}
            />
            <Field
              label="Label"
              name={"metrics." + i + ".label"}
              value={m.label}
            />
          </div>
        ))}
      </section>
      <section className="studio-card">
        <div className="card-heading">
          <span>04</span>
          <h2>Homepage sections</h2>
        </div>
        <p className="studio-muted">
          Edit section headings here. Edit full page text in Pages.
        </p>
        {Object.entries(s.sections).map(([key, sec]) => (
          <details className="settings-section" key={key}>
            <summary>{key.charAt(0).toUpperCase() + key.slice(1)}</summary>
            <Field
              label="Eyebrow"
              name={"sections." + key + ".eyebrow"}
              value={sec.eyebrow}
            />
            <Field
              label="Heading"
              name={"sections." + key + ".title"}
              value={sec.title}
            />
            <Field
              label="Description"
              name={"sections." + key + ".description"}
              value={sec.description}
              area
            />
            <Field
              label="Image URL"
              name={"sections." + key + ".imageUrl"}
              value={sec.imageUrl}
            />
          </details>
        ))}
      </section>
      <section className="studio-card">
        <div className="card-heading">
          <span>05</span>
          <h2>Contact information</h2>
        </div>
        {fields([
          ["contactEmail", "Public email address"],
          ["contactPhone", "Public phone number"],
          ["contactAddress", "Public address", true],
        ])}
        <p className="studio-muted">
          Leave blank to hide. Phone and email also appear in the top bar.
        </p>
      </section>
      <section className="studio-card">
        <div className="card-heading">
          <span>06</span>
          <h2>Social links</h2>
        </div>
        <div className="form-row">
          {socialNetworks.map((k) => (
            <Field
              key={k}
              label={socialLabels[k]}
              name={"social." + k}
              value={s.social[k]}
              type="url"
            />
          ))}
        </div>
        <p className="studio-muted">
          Paste full https:// links to your profiles. Icons show in the top bar
          and footer; leave blank to hide a network.
        </p>
      </section>
      <div className="sticky-save">
        <Result state={state} />
        <button className="studio-button" disabled={pending}>
          {pending ? "Saving…" : "Save website settings ↗"}
        </button>
      </div>
    </form>
  );
}
export function EnquiryActions({ item }: { item: Enquiry }) {
  const [state, action, pending] = useActionState(updateEnquiry, initial);
  const [confirm, setConfirm] = useState(false);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={item.id} />
      <label className="field">
        Status
        <select name="status" defaultValue={item.status}>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
          {confirm && <option value="delete">Permanently delete</option>}
        </select>
      </label>
      <div className="action-row">
        <button className="studio-button" disabled={pending}>
          Update
        </button>
        <button
          type="button"
          className="danger-link"
          onClick={() => setConfirm(!confirm)}
        >
          Allow deletion
        </button>
      </div>
      {confirm && (
        <p className="form-note">
          Choose “Permanently delete” above and click Update to confirm.
        </p>
      )}
      <Result state={state} />
    </form>
  );
}
