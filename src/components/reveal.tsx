"use client";
import { useEffect } from "react";
// Fades [data-reveal] elements in as they scroll into view. Content stays visible
// without JavaScript or with reduced motion, because hiding only starts once this runs.
// A MutationObserver also picks up elements added later (filters, search results,
// query-string navigation), so nothing can be left hidden until a refresh.
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("np-anim");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("np-in");
            io.unobserve(entry.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const watch = (root: ParentNode) => {
      if (root instanceof Element && root.matches("[data-reveal]:not(.np-in)"))
        io.observe(root);
      root
        .querySelectorAll("[data-reveal]:not(.np-in)")
        .forEach((el) => io.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const record of records)
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) watch(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      document.documentElement.classList.remove("np-anim");
    };
  }, []);
  return null;
}
