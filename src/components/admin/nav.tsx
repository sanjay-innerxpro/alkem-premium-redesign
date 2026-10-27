"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
const links = [
  ["/admin", "Overview", "◫"],
  ["/admin/settings", "Website settings", "⚙"],
  ["/admin/content?collection=pages", "Pages", "▤"],
  ["/admin/content?collection=offerings", "Offerings", "◇"],
  ["/admin/content?collection=therapies", "Therapies", "✳"],
  ["/admin/content?collection=news", "News & stories", "▧"],
  ["/admin/content?collection=careers", "Careers", "↗"],
  ["/admin/enquiries", "Enquiries", "✉"],
];
export function StudioNav() {
  const path = usePathname();
  const search = useSearchParams();
  return (
    <nav className="studio-nav" aria-label="Content studio">
      {links.map(([href, label, icon]) => {
        const active = href.includes("?")
          ? path.startsWith("/admin/content") &&
            search.get("collection") === href.split("=")[1]
          : path === href;
        return (
          <Link
            href={href}
            key={href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
          >
            <span>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
