import Link from "next/link";
export function Brand({
  name = "ALKEM",
  tagline = "INSPIRING HEALTHIER LIVES",
}: {
  name?: string;
  tagline?: string;
}) {
  return (
    <Link href="/" className="brand" aria-label={name + " home"}>
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M24 3 45 24 24 45 3 24 24 3Z"
            stroke="currentColor"
            strokeWidth="3.4"
          />
          <path
            d="m14 29 10-15 10 15M18 24h12"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="brand-copy">
        <strong>{name}</strong>
        <small>{tagline}</small>
      </span>
    </Link>
  );
}
