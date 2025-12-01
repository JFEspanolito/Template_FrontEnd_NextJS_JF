const config = {
  // ======================================================
  // 🔧 PROYECTO BASE (placeholders)
  // ======================================================
  appName: "PLACEHOLDER_APP_NAME",
  appDescription: "PLACEHOLDER_APP_DESCRIPTION",
  domainName: "example.com",

  // ======================================================
  // 🌐 METADATOS / SEO (placeholders)
  // ======================================================
  language: "en-US",
  themeColor: "#000000",
  // Color tokens used across the app (placeholders)
  colors: {
    main: "#111111",
    background: "#000000",
    foreground: "#ffffff",
  },
  keywords: ["placeholder", "example"],
  author: "PLACEHOLDER_AUTHOR",
  twitter: "@PLACEHOLDER",
  // keep a valid URL so code that does `new URL(config.siteUrl)` won't throw
  siteUrl: "https://example.com",

  // Rutas hacia imágenes base (placeholders)
  images: {
    ogDefault: "/images/placeholder.webp",
    twitterCard: "/images/placeholder.webp",
    favicon: "/favicon.ico",
    icon16: "/favicon.ico",
    icon32: "/favicon.ico",
    icon192: "/images/placeholder-192.png",
    icon512: "/images/placeholder-512.png",
    appleTouch: "/images/placeholder-apple.png",
    safariMask: "/images/placeholder-mask.png",
  },

  // ======================================================
  // 💬 SOPORTE / CONTACTO (placeholders)
  // ======================================================
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `no-reply@example.com`,
    fromAdmin: `Admin <no-reply@example.com>`,
    supportEmail: "support@example.com",
  },

  // ======================================================
  // 📣 MARKETING (placeholders)
  // ======================================================
  marketing: {
    tagline: "PLACEHOLDER_TAGLINE",
    testimonials: {
      headline: "PLACEHOLDER_TESTIMONIAL_HEADLINE",
      subhead: "PLACEHOLDER_TESTIMONIAL_SUBHEAD",
      items: [],
    },
  },

  // ======================================================
  // 🔗 REDES SOCIALES (para JSON-LD) - placeholders
  // ======================================================
  socials: {
    github: "https://github.com/placeholder",
    linkedin: "https://linkedin.com/placeholder",
    twitter: "https://twitter.com/placeholder",
    instagram: "https://instagram.com/placeholder",
  },
};

export default config;
