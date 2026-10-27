"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="np np-standalone">
      <div className="np-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="np-standalone__inner">
        <span className="np-pill">
          <i />
          Temporarily unavailable
        </span>
        <h1>
          A brief <em className="np-gradient-text">pause.</em>
        </h1>
        <p>We couldn’t load this page. Please try again shortly.</p>
        <button className="np-btn np-btn--light np-btn--lg" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
