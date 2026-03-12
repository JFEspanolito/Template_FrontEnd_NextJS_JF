interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  submenu?: NavSubItem[];
}

interface NavigationLocale {
  [key: string]: NavItem;
}

export interface ConfigProject {
  // Proyecto
  appName: string;
  tabname: string;
  appDescription: string;
  ogTitle: string;
  ogDescription: string;
  domainName: string;
  siteUrl: string;
  copyright_es: string;
  copyright_en: string;

  // SEO / Metadatos
  language: string;
  themeColor: string;
  colors: {
    main: string;
    background: string;
    foreground: string;
  };
  keywords: string[];
  author: string;
  twitter: string;

  // Imagenes
  images: {
    ogDefault: string;
    twitterCard: string;
    favicon: string;
    icon16: string;
    icon32: string;
    icon192: string;
    icon512: string;
    appleTouch: string;
    safariMask: string;
  };

  // Soporte
  support: {
    email: string;
  };

  // Resend
  resend: {
    fromAdmin: string;
    fromNoReply: string;
  };

  // Redes sociales (opcional — usado por SocialDock)
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };

  // Marketing
  marketing: {
    tagline: string;
    testimonials: {
      headline: string;
      subhead: string;
      items: unknown[];
    };
  };

  // Navegacion i18n
  navigation: {
    ES: NavigationLocale;
    EN: NavigationLocale;
  };
}

const configProject: ConfigProject = {
  // ======================================================
  // 🧩 PROYECTO (metadata / web)
  // ======================================================
  appName: "<Place holder>",
  tabname: "<Place holder>",
  appDescription: "<Place holder>",
  ogTitle: "<Place holder>",
  ogDescription: "<Place holder>",
  domainName: "placeholder.com",
  siteUrl: "http://localhost:3000",
  copyright_es: `© ${new Date().getFullYear()} — Todos los derechos reservados.`,
  copyright_en: `© ${new Date().getFullYear()} — All rights reserved.`,

  // ======================================================
  // 🌐 METADATOS / SEO
  // ======================================================
  language: "en-US",
  themeColor: "#000000",
  colors: {
    main: "#111111",
    background: "#000000",
    foreground: "#ffffff",
  },
  keywords: ["placeholder"],
  author: "<Place holder>",
  twitter: "@<Place holder>",

  // Rutas hacia imagenes base
  // se recomienda que las imagenes sean de 1200x630px para OG y 1024x512px para Twitter
  images: {
    ogDefault: "/PageCover/cover.webp",
    twitterCard: "/PageCover/cover.webp",
    favicon: "/PageCover/favicon.ico",
    icon16: "/PageCover/favicon.ico",
    icon32: "/PageCover/favicon.ico",
    icon192: "/PageCover/cover.webp",
    icon512: "/PageCover/cover.webp",
    appleTouch: "/PageCover/cover.webp",
    safariMask: "/PageCover/cover.webp",
  },

  // ======================================================
  // 💬 SOPORTE / CONTACTO (publico)
  // ======================================================
  support: {
    email: "correo@placeholder.com",
  },

  // ======================================================
  // ✉️ RESEND (client-side references)
  // ======================================================
  resend: {
    fromAdmin: "admin@placeholder.com",
    fromNoReply: "noreply@placeholder.com",
  },

  // ======================================================
  // 🔗 REDES SOCIALES (para SocialDock / JSON-LD)
  // ======================================================
  socials: {
    github: "https://github.com/placeholder",
    linkedin: "https://linkedin.com/placeholder",
    twitter: "https://twitter.com/placeholder",
    instagram: "https://instagram.com/placeholder",
  },

  // ======================================================
  // 📣 MARKETING (placeholders)
  // ======================================================
  marketing: {
    tagline: "<Place holder>",
    testimonials: {
      headline: "<Place holder>",
      subhead: "<Place holder>",
      items: [],
    },
  },

  // ======================================================
  // 🧭 NAVEGACION (labels y rutas i18n)
  // ======================================================
  navigation: {
    ES: {
      home: { label: "Inicio", href: "#Resumen" },
      services: {
        label: "Servicios",
        submenu: [
          { label: "Submenu 1", href: "#Submenu1" },
          { label: "Submenu 2", href: "#Submenu2" },
        ],
      },
    },
    EN: {
      home: { label: "Home", href: "#Resumen" },
      services: {
        label: "Services",
        submenu: [
          { label: "Submenu 1", href: "#Submenu1" },
          { label: "Submenu 2", href: "#Submenu2" },
        ],
      },
    },
  },
};

export default configProject;
