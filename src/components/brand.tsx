import Link from "next/link";
// The logo symbol (Website settings → Logo) on a white tile; without one, the brand initial.
export const initialOf = (name: string) =>
  (Array.from(name.trim())[0] ?? "").toUpperCase();
export function Mark({
  name,
  logo = "",
  size = 40,
}: {
  name: string;
  logo?: string;
  size?: number;
}) {
  if (logo)
    return (
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#fff" />
        <image href={logo} x="5" y="5" width="30" height="30" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="np-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22B3A0" />
          <stop offset=".55" stopColor="#1F9BB5" />
          <stop offset="1" stopColor="#2F7FA3" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#np-mark)" />
      <text
        x="19"
        y="21.5"
        fill="#fff"
        fontSize="23"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: "var(--np-sans)" }}
      >
        {initialOf(name)}
      </text>
      <circle cx="31" cy="9" r="2.6" fill="#fff" />
    </svg>
  );
}
export function Brand({
  name,
  tagline,
  logo,
}: {
  name: string;
  tagline: string;
  logo?: string;
}) {
  return (
    <Link href="/" className="np-brand" aria-label={name + " home"}>
      <Mark name={name} logo={logo} />
      <span className="np-brand__copy">
        <strong>{name}</strong>
        <small>{tagline}</small>
      </span>
    </Link>
  );
}
