import { getEnquiries } from "@/lib/content";
import { EnquiryActions } from "@/components/admin/forms";
export default async function Enquiries() {
  const items = await getEnquiries();
  return (
    <>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">Inbox</span>
          <h1>Enquiries</h1>
          <p>
            Review and manage website and career enquiries. Showing the latest
            500 messages.
          </p>
        </div>
      </div>
      {!items.length ? (
        <section className="studio-card empty-state">
          <span>✉</span>
          <h2>No enquiries yet</h2>
          <p>New website enquiries will appear here.</p>
        </section>
      ) : (
        <div className="enquiry-list">
          {items.map((x) => (
            <details className="studio-card enquiry" key={x.id}>
              <summary>
                <div>
                  <span
                    className={
                      "badge " + (x.status === "new" ? "published" : "draft")
                    }
                  >
                    {x.status}
                  </span>
                  <strong>{x.subject}</strong>
                  <small>
                    {x.name} · {x.email}
                  </small>
                </div>
                <time>
                  {new Date(x.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}{" "}
                  IST
                </time>
              </summary>
              <div className="enquiry-body">
                <p className="prose">{x.message}</p>
                <a className="inline-link" href={"mailto:" + x.email}>
                  Reply by email ↗
                </a>
                <EnquiryActions item={x} />
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
