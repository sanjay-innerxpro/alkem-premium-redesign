"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
// Fades [data-reveal] elements in as they scroll into view. Content stays visible
// without JavaScript or with reduced motion, because hiding only starts once this runs.
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("np-anim");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("np-in");
            observer.unobserve(entry.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]:not(.np-in)")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
