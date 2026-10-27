"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
const links = [
  ["/admin", "Overview", "sparkle"],
  ["/admin/settings", "Website settings", "shield"],
  ["/admin/content?collection=pages", "Pages", "flask"],
  ["/admin/content?collection=products", "Products", "pill"],
  ["/admin/content?collection=offerings", "Offerings", "award"],
  ["/admin/content?collection=therapies", "Therapies", "heart"],
  ["/admin/content?collection=news", "News & stories", "globe"],
  ["/admin/content?collection=careers", "Careers", "users"],
  ["/admin/enquiries", "Enquiries", "mail"],
];
export function StudioNav() {
  const path = usePathname();
  const search = useSearchParams();
  return (
    <nav className="studio-nav" aria-label="Content studio">
      {links.map(([href, label, icon]) => {
        const active = href.includes("?")
          ? path.startsWith("/admin/content") &&
            (search.get("collection") || "pages") === href.split("=")[1]
          : path === href;
        return (
          <Link
            href={href}
            key={href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={icon} size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
