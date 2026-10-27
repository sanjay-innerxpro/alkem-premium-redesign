import Link from "next/link";
import { getContent, getEnquiries } from "@/lib/content";
import { db } from "@/lib/db";
import { collections } from "@/lib/types";
import { Icon } from "@/components/icons";
import type { RowDataPacket } from "mysql2/promise";
const collectionIcons: Record<string, string> = {
  pages: "flask",
  products: "pill",
  offerings: "award",
  therapies: "heart",
  news: "globe",
  careers: "users",
};
export default async function Overview() {
  const [content, enquiries, [activity]] = await Promise.all([
    getContent(undefined, true),
    getEnquiries(),
    db().query<RowDataPacket[]>(
      "SELECT action,target,created_at FROM audit_log ORDER BY id DESC LIMIT 6",
    ),
  ]);
  const published = content.filter((x) => x.published).length;
  const count = (c: string) => content.filter((x) => x.collection === c).length;
  return (
    <>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">Overview</span>
          <h1>Welcome back.</h1>
          <p>Here’s what’s happening on your website.</p>
        </div>
        <Link className="studio-secondary" href="/" target="_blank">
          <Icon name="globe" size={16} /> View website
        </Link>
      </div>
      <div className="dashboard-stats">
        {[
          [String(count("products")), "Products", "pill", "/admin/content?collection=products"],
          [String(published), "Published items", "sparkle", "/admin/content?collection=pages"],
          [
            String(enquiries.filter((x) => x.status === "new").length),
            "New enquiries",
            "mail",
            "/admin/enquiries",
          ],
          [
            String(content.filter((x) => x.collection === "careers" && x.published).length),
            "Open positions",
            "users",
            "/admin/content?collection=careers",
          ],
        ].map(([n, label, icon, href]) => (
          <Link className="stat-card" key={label} href={href}>
            <span>
              <Icon name={icon} size={20} />
            </span>
            <strong>{n}</strong>
            <small>{label}</small>
          </Link>
        ))}
      </div>
      <section className="studio-welcome">
        <div>
          <span className="section-label section-label-light">Quick start</span>
          <h2>Keep your website fresh.</h2>
          <p>
            Add your real products, update contact details and social links,
            and publish news or job openings.
          </p>
          <div className="action-row">
            <Link className="button button-white" href="/admin/content/new?collection=products">
              + Add product
            </Link>
            <Link className="button button-ghost" href="/admin/settings">
              Website settings
            </Link>
          </div>
        </div>
        <img src="/illustrations/capsule.svg" alt="" />
      </section>
      <div className="dashboard-grid">
        <section className="studio-card">
          <div className="card-heading">
            <h2>Content</h2>
          </div>
          {collections.map((c) => (
            <Link
              key={c}
              className="collection-row"
              href={"/admin/content?collection=" + c}
            >
              <span className="collection-icon">
                <Icon name={collectionIcons[c]} size={18} />
              </span>
              <div>
                <strong>{c.charAt(0).toUpperCase() + c.slice(1)}</strong>
                <small>{count(c)} items</small>
              </div>
              <Icon name="arrow" size={16} />
            </Link>
          ))}
        </section>
        <section className="studio-card">
          <div className="card-heading">
            <h2>Recent activity</h2>
          </div>
          {activity.length ? (
            activity.map((x, i) => (
              <div className="activity-row" key={i}>
                <span className="activity-dot" />
                <div>
                  <strong>{x.action.replaceAll(".", " · ")}</strong>
                  <small>{x.target}</small>
                  <time>
                    {new Date(x.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}{" "}
                    IST
                  </time>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state compact">
              <span>
                <Icon name="sparkle" size={22} />
              </span>
              <h3>No activity yet</h3>
              <p>Your edits will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
