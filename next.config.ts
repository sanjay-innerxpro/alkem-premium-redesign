import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "X-Frame-Options",
            value:
              process.env.NODE_ENV === "development" ? "SAMEORIGIN" : "DENY",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self' ${process.env.NODE_ENV === "development" ? "ws: wss:" : ""}; frame-ancestors ${process.env.NODE_ENV === "development" ? "'self'" : "'none'"}; form-action 'self'; base-uri 'self'`,
          },
        ],
      },
    ];
  },
};
export default config;
