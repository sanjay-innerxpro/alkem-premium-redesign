import Link from "next/link";
export function Banner({
  label,
  title,
  text,
  crumbs = [],
  home = "Home",
  children,
}: {
  label: string;
  title: string;
  text?: string;
  crumbs?: [string, string][];
  home?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="np-banner">
      <div className="np-aurora np-aurora--soft" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="np-hero__grid" aria-hidden="true" />
      <div className="np-wrap np-banner__inner">
        <nav className="np-crumbs" aria-label="Breadcrumb">
          <Link href="/">{home}</Link>
          {crumbs.map(([href, name]) => (
            <span key={href}>
              <i>/</i>
              <Link href={href}>{name}</Link>
            </span>
          ))}
          <span>
            <i>/</i>
            <span aria-current="page">{label}</span>
          </span>
        </nav>
        <span className="np-pill">
          <i />
          {label}
        </span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        {children}
      </div>
    </section>
  );
}
