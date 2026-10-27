"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone-message">
      <span className="section-label">TEMPORARILY UNAVAILABLE</span>
      <h1>A brief pause.</h1>
      <p>We couldn’t load this page. Please try again shortly.</p>
      <button className="button button-primary" onClick={reset}>
        Try again ↗
      </button>
    </main>
  );
}
