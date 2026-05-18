import "server-only";

const readEnv = (key: string): string => process.env[key] ?? "";

const requireEnv = (key: string): string => {
  const value = readEnv(key);
  if (!value) throw new Error(`[CRITICAL] Missing required env var: ${key}`);
  return value;
};

const configApi = {
  runtime: {
    get nodeEnv() {
      return readEnv("NODE_ENV") || "development";
    },
    get isDevelopment() {
      return configApi.runtime.nodeEnv === "development";
    },
  },
  auth: {
    get callbackUrl() {
      return readEnv("NEXT_PUBLIC_AUTH_CALLBACK_URL") || "/dashboard";
    },
  },
  supabase: {
    get url() {
      return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
    },
    get anonKey() {
      return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    },
    get serviceRoleKey() {
      return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    },
  },
  stripe: {
    get secretKey() {
      return requireEnv("STRIPE_SECRET_KEY");
    },
    get webhookSecret() {
      return requireEnv("STRIPE_WEBHOOK_SECRET");
    },
  },
  resend: {
    get apiKey() {
      return requireEnv("RESEND_API_KEY");
    },
  },
  ai: {
    get openai() {
      return readEnv("OPENAI_API_KEY");
    },
    get claude() {
      return readEnv("CLAUDE_API_KEY");
    },
  },
} as const;

export default configApi;
