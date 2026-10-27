import Link from "next/link";
import { getContent, getEnquiries } from "@/lib/content";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
export default async function Overview() {
  const [content, enquiries, [activity]] = await Promise.all([
    getContent(undefined, true),
    getEnquiries(),
    db().query<RowDataPacket[]>(
      "SELECT action,target,created_at FROM audit_log ORDER BY id DESC LIMIT 6",
    ),
  ]);
  const published = content.filter((x) => x.published).length;
  return (
    <>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">
            A LITTLE CLARITY. A LOT OF POSSIBILITY.
          </span>
          <h1>Your website, at a glance.</h1>
          <p>A place for your content to grow.</p>
        </div>
        <Link className="studio-secondary" href="/" target="_blank">
          View website ↗
        </Link>
      </div>
      <div className="dashboard-stats">
        {[
          [String(published), "Published items", "↗"],
          [String(content.length - published), "Drafts in progress", "▤"],
          [
            String(enquiries.filter((x) => x.status === "new").length),
            "New enquiries",
            "✉",
          ],
          [
            String(
              content.filter((x) => x.collection === "careers" && x.published)
                .length,
            ),
            "Open opportunities",
            "◇",
          ],
        ].map(([n, label, icon]) => (
          <div className="stat-card" key={label}>
            <span>{icon}</span>
            <strong>{n}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <section className="studio-welcome">
        <div>
          <span className="section-label section-label-light">
            MAKE IT YOURS
          </span>
          <h2>
            Good stories deserve
            <br />a thoughtful home.
          </h2>
          <p>
            Keep your pages current, share new perspectives and help visitors
            find what matters.
          </p>
          <Link className="button button-white" href="/admin/settings">
            Edit your website <span className="round-arrow">↗</span>
          </Link>
        </div>
        <img src="/science.svg" alt="" />
      </section>
      <div className="dashboard-grid">
        <section className="studio-card">
          <div className="card-heading">
            <h2>Content collections</h2>
            <span>05</span>
          </div>
          {["pages", "offerings", "therapies", "news", "careers"].map((c) => (
            <Link
              key={c}
              className="collection-row"
              href={"/admin/content?collection=" + c}
            >
              <div>
                <strong>{c.charAt(0).toUpperCase() + c.slice(1)}</strong>
                <small>
                  {content.filter((x) => x.collection === c).length} items
                </small>
              </div>
              <span>↗</span>
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
              <span>◷</span>
              <h3>A fresh start.</h3>
              <p>Your editing activity will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
