import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
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
      <section className="login-art">
        <Link className="login-brand" href="/">
          ◇ ALKEM
        </Link>
        <div>
          <span className="section-label section-label-light">
            THE CONTENT STUDIO
          </span>
          <h1>
            A thoughtful space
            <br />
            for meaningful
            <br />
            <em>stories.</em>
          </h1>
          <p>Shape the next chapter of your digital experience.</p>
        </div>
        <span>INDEPENDENT DESIGN CONCEPT</span>
      </section>
      <section className="login-content">
        <Link href="/" className="back-link">
          ← Back to website
        </Link>
        <div>
          <span className="section-kicker">WELCOME BACK</span>
          <h2>
            Your next chapter
            <br />
            starts here.
          </h2>
          <p>Sign in to manage your website.</p>
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
        <span className="studio-muted">Science. Care. Possibility.</span>
      </section>
    </main>
  );
}
