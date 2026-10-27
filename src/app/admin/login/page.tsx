import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Mark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { isDemo } from "@/lib/db";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Content Studio · Sign in",
  robots: { index: false, follow: false },
};
const features = [
  ["pill", "Products & catalogue", "Add, edit and publish medicines."],
  ["mail", "Enquiries inbox", "Reply to doctors, partners and applicants."],
  ["shield", "Website settings", "Brand, contact details and social links."],
];
export default async function Login() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main className="login-page">
      <div className="login-bg" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header className="login-top">
        <Link className="login-brand" href="/">
          <Mark size={36} />
          <span>
            <strong>NexPharm</strong>
            <small>Content Studio</small>
          </span>
        </Link>
        <Link href="/" className="login-back">
          <Icon name="globe" size={16} /> Back to website
        </Link>
      </header>
      <div className="login-shell">
        <section className="login-side">
          <span className="login-eyebrow">
            <i /> Secure workspace
          </span>
          <h1>
            Welcome back to <em>NexPharm.</em>
          </h1>
          <p>
            Everything that powers your website — in one calm, focused place.
          </p>
          <ul className="login-features">
            {features.map(([icon, title, text]) => (
              <li key={title}>
                <span>
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </li>
            ))}
          </ul>
          <img src="/illustrations/capsule.svg" alt="" className="login-capsule" />
        </section>
        <section className="login-card">
          <h2>Sign in</h2>
          <p className="login-sub">Use your administrator email and password.</p>
          {isDemo() ? (
            <div className="notice">
              This is a read-only preview. Connect MySQL and create your own
              administrator to enable the content studio.
            </div>
          ) : (
            <LoginForm />
          )}
          <p className="login-secure">
            <Icon name="shield" size={15} />
            Protected by encrypted, expiring sessions. Administrator access only.
          </p>
        </section>
      </div>
      <footer className="login-foot">
        © {new Date().getFullYear()} NexPharm Healthcare Private Limited
      </footer>
    </main>
  );
}
