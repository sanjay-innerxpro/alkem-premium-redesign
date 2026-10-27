import Link from "next/link";
import { Mark } from "@/components/brand";
export default function NotFound() {
  return (
    <main id="main" className="np np-standalone">
      <div className="np-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="np-standalone__inner">
        <Mark size={52} />
        <span className="np-pill">
          <i />
          404 · Page not found
        </span>
        <h1>
          Let’s find you a <em className="np-gradient-text">new direction.</em>
        </h1>
        <p>This page may have moved or is no longer available.</p>
        <Link className="np-btn np-btn--light np-btn--lg" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
