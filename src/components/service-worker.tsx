"use client";
import { useEffect } from "react";
// Registers public/sw.js (offline fallback page) in production only, so development
// hot reloading is never served through a service worker.
export function ServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
