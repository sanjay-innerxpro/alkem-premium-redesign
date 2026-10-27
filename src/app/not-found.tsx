import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="standalone-message">
      <span className="section-label">404 / PAGE NOT FOUND</span>
      <h1>Let’s find a new direction.</h1>
      <p>This page may have moved or is no longer published.</p>
      <Link className="button button-primary" href="/">
        Back to home ↗
      </Link>
    </main>
  );
}
