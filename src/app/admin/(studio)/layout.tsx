import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { StudioNav } from "@/components/admin/nav";
import { Mark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { getSettings } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: `${s.brand} Content Studio`,
    robots: { index: false, follow: false },
  };
}
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, s] = await Promise.all([requireAdmin(), getSettings()]);
  return (
    <div className="studio">
      <aside className="studio-sidebar">
        <div className="studio-sidebar__top">
          <Link href="/admin" className="studio-logo">
            <Mark name={s.brand} logo={s.logoUrl} size={36} />
            <div>
              <strong>{s.brand}</strong>
              <small>Content Studio</small>
            </div>
          </Link>
          <form
            action="/api/auth/logout"
            method="post"
            className="studio-signout-mobile"
          >
            <button aria-label="Sign out">Sign out</button>
          </form>
        </div>
        <span className="sidebar-label">Workspace</span>
        <Suspense>
          <StudioNav />
        </Suspense>
        <div className="sidebar-bottom">
          <Link href="/" target="_blank">
            <Icon name="globe" size={16} /> Visit website
          </Link>
          <div className="sidebar-user">
            <span className="avatar">{admin.email[0].toUpperCase()}</span>
            <span className="admin-email">{admin.email}</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button>Sign out</button>
          </form>
        </div>
      </aside>
      <div className="studio-body">
        <main id="main" className="studio-main">
          {children}
        </main>
        <footer className="studio-footer">
          {s.brand} {s.tagline} · Content Studio
        </footer>
      </div>
    </div>
  );
}
