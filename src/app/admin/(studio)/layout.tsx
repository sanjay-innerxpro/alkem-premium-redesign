import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { StudioNav } from "@/components/admin/nav";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Alkem Content Studio",
  robots: { index: false, follow: false },
};
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <div className="studio">
      <aside className="studio-sidebar">
        <Link href="/admin" className="studio-logo">
          <span>◇</span>
          <div>
            <strong>ALKEM</strong>
            <small>CONTENT STUDIO</small>
          </div>
        </Link>
        <span className="sidebar-label">WORKSPACE</span>
        <Suspense>
          <StudioNav />
        </Suspense>
        <div className="sidebar-bottom">
          <Link href="/" target="_blank">
            Visit website ↗
          </Link>
          <span className="admin-email">{admin.email}</span>
          <form action="/api/auth/logout" method="post">
            <button>Sign out ↗</button>
          </form>
        </div>
      </aside>
      <div className="studio-body">
        <header className="studio-topbar">
          <span>YOUR DIGITAL WORKSPACE</span>
          <div>
            <span className="status-dot" />
            Content studio{" "}
            <span className="avatar">{admin.email[0].toUpperCase()}</span>
          </div>
        </header>
        <main id="main" className="studio-main">
          {children}
        </main>
        <footer className="studio-footer">
          Independent design concept · Alkem Content Studio
        </footer>
      </div>
    </div>
  );
}
