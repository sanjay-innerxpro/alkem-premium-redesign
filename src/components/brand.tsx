import Link from "next/link";
export function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="np-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2DD4BF" />
          <stop offset=".55" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#7C6CF6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#np-mark)" />
      <path
        d="M12.5 28V12.5L27.5 28V12.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="31" cy="9" r="2.6" fill="#fff" />
    </svg>
  );
}
export function Brand({
  name = "NexPharm",
  tagline = "Healthcare Private Limited",
}: {
  name?: string;
  tagline?: string;
}) {
  return (
    <Link href="/" className="np-brand" aria-label={name + " home"}>
      <Mark />
      <span className="np-brand__copy">
        <strong>{name}</strong>
        <small>{tagline}</small>
      </span>
    </Link>
  );
}
