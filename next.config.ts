import type { NextConfig } from "next";

const securityHeaders = [
  // CORE — hardening HTTP básico para sitio estático
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // evita clickjacking
  { key: "X-XSS-Protection", value: "1; mode=block" }, // legacy, lo piden scanners
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },

  // CORE — extras que suelen revisar scanners
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },

  // CSP — política base (compatible con Next + Tailwind)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "upgrade-insecure-requests",
    ].join("; "),
  },

  /*
  // CORS — NO APLICA para sitio standalone (HTML estático, sin APIs)
  // Quitar CORS reduce superficie de ataque innecesaria.
  // Solo descomentar si en el futuro agregas APIs / fetch cross-origin.

  { key: "Access-Control-Allow-Origin", value: "https://localhost.dev" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  */
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
