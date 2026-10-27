import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Mark } from "@/components/brand";
import { isDemo } from "@/lib/db";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Content Studio · Sign in",
  robots: { index: false, follow: false },
};
export default async function Login() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main className="login-page">
      <section className="login-art" aria-hidden="true">
        <Link className="login-brand" href="/" tabIndex={-1}>
          <Mark size={40} />
          <span>
            <strong>NexPharm</strong>
            <small>Healthcare Private Limited</small>
          </span>
        </Link>
        <div>
          <span className="section-label section-label-light">
            Content Studio
          </span>
          <h1>
            Manage your website,
            <br />
            <em>beautifully.</em>
          </h1>
          <p>Products, pages, careers and enquiries — all in one place.</p>
        </div>
        <img src="/illustrations/capsule.svg" alt="" className="login-capsule" />
      </section>
      <section className="login-content">
        <Link href="/" className="back-link">
          ← Back to website
        </Link>
        <div className="login-card">
          <Link className="login-brand login-brand--mobile" href="/">
            <Mark size={36} />
            <strong>NexPharm</strong>
          </Link>
          <span className="section-kicker">Welcome back</span>
          <h2>Sign in to your workspace</h2>
          <p>Use your administrator email and password.</p>
          {isDemo() ? (
            <div className="notice">
              This is a read-only preview. Connect MySQL and create your own
              administrator to enable the content studio.
            </div>
          ) : (
            <LoginForm />
          )}
          <p className="form-note">
            Administrator access only. Accounts are created by the site
            operator.
          </p>
        </div>
      </section>
    </main>
  );
}
