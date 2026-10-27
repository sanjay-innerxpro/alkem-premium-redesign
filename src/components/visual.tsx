"use client";
import { useState } from "react";
export function Visual({
  src,
  alt,
  className = "",
  fallback = "/illustrations/lab.svg",
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [failed, setFailed] = useState(false);
  // Plain img intentionally supports administrator-selected HTTPS content without a wildcard image proxy.
  return (
    <img
      src={failed || !src ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
