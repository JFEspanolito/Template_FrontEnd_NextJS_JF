import "server-only";

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const configApi = {
  // ======================================================
  // 🔐 NextAuth (server)
  // ======================================================
  nextAuth: {
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    secret: process.env.NEXTAUTH_SECRET || "",
    require: {
      secret: () => requireEnv("NEXTAUTH_SECRET"),
    },
  },

  // ======================================================
  // 🔐 Auth (server)
  // ======================================================
  auth: {
    callbackUrl: process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || "/dashboard",
  },

  // ======================================================
  // 🔐 Google OAuth (server)
  // ======================================================
  googleOAuth: {
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
    require: {
      clientId: () => requireEnv("GOOGLE_ID"),
      clientSecret: () => requireEnv("GOOGLE_SECRET"),
    },
  },

  // ======================================================
  // 🗄️ MongoDB (server)
  // ======================================================
  mongodb: {
    uri: process.env.MONGODB_URI || "",
    require: {
      uri: () => requireEnv("MONGODB_URI"),
    },
  },

  // ======================================================
  // 💳 Stripe (server)
  // ======================================================
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY || "",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    require: {
      secretKey: () => requireEnv("STRIPE_SECRET_KEY"),
      webhookSecret: () => requireEnv("STRIPE_WEBHOOK_SECRET"),
    },
  },

  // ======================================================
  // ✉️ Resend (server)
  // ======================================================
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    fromNoReply: process.env.RESEND_FROM_NO_REPLY || "noreply@example.com",
    fromAdmin: process.env.RESEND_FROM_ADMIN || "admin@example.com",
    require: {
      apiKey: () => requireEnv("RESEND_API_KEY"),
    },
  },

  // ======================================================
  // ☁️ AWS (server/client as needed)
  // (Si solo usas URLs públicas en frontend, muévelas a configProject.ts)
  // ======================================================
  aws: {
    bucket: process.env.NEXT_PUBLIC_AWS_BUCKET || "",
    bucketUrl: process.env.NEXT_PUBLIC_AWS_BUCKET_URL || "",
    cdn: process.env.NEXT_PUBLIC_AWS_CDN || "",
  },

  // ======================================================
  // 💬 Crisp (client widget id; aquí solo si tu API lo necesita)
  // ======================================================
  crisp: {
    id: process.env.NEXT_PUBLIC_CRISP_ID || "",
  },

  // ======================================================
  // 💳 Stripe Price IDs (solo si tu API los necesita)
  // ======================================================
  stripePrices: {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    advanced: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED || "",
  },
};

export default configApi;