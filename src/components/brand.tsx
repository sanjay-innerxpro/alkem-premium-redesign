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
        <image href={logo} x="3" y="3" width="34" height="34" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="np-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38A9D0" />
          <stop offset=".55" stopColor="#3A6DB3" />
          <stop offset="1" stopColor="#2B2C73" />
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
// Two-tone wordmark like the logo: "NexPharm" → "Nex" + "Pharm". Names without a second
// capital stay one colour.
export const splitWordmark = (name: string): [string, string] => {
  const m = /^(\p{Lu}[^\p{Lu}\s]+)(\p{Lu}.*)$/u.exec(name.trim());
  return m ? [m[1], m[2]] : [name, ""];
};
// The full logo artwork on a white card, so its navy text stays legible on dark headers.
export function Logo({
  src,
  alt,
  height = 44,
}: {
  src: string;
  alt: string;
  height?: number;
}) {
  return (
    <span className="np-logo" style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} fetchPriority="high" decoding="async" />
    </span>
  );
}
export function Brand({
  name,
  tagline,
  logo,
  wordmark,
}: {
  name: string;
  tagline: string;
  logo?: string;
  wordmark?: string;
}) {
  const [head, tail] = splitWordmark(name);
  if (wordmark)
    return (
      <Link href="/" className="np-brand" aria-label={name + " home"}>
        <Logo src={wordmark} alt={name + " " + tagline} height={58} />
      </Link>
    );
  return (
    <Link href="/" className="np-brand" aria-label={name + " home"}>
      <Mark name={name} logo={logo} />
      <span className="np-brand__copy">
        <strong>
          {head}
          {tail && <span className="np-brand__tail">{tail}</span>}
        </strong>
        <small>{tagline}</small>
      </span>
    </Link>
  );
}
