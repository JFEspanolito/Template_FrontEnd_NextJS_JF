import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthOptions, Profile } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import configApi from "@/data/configApi";
import mongoClientPromise from "./db";
import User from "@/models/User";
import configProject from "@/data/configProject";

const authLogoUrl = new URL("/logoAndName.webp", configApi.nextAuth.url).toString();

interface GoogleProfile extends Profile {
  sub: string;
  given_name?: string;
  picture?: string;
}

// Read env vars once and conditionally add providers
const GOOGLE_ID = configApi.oauth.google.id;
const GOOGLE_SECRET = configApi.oauth.google.secret;
const GITHUB_ID = configApi.oauth.github.id;
const GITHUB_SECRET = configApi.oauth.github.secret;
const LINKEDIN_ID = configApi.oauth.linkedin.id;
const LINKEDIN_SECRET = configApi.oauth.linkedin.secret;
const FACEBOOK_ID = configApi.oauth.facebook.id;
const FACEBOOK_SECRET = configApi.oauth.facebook.secret;
const RESEND_API_KEY = configApi.resend.apiKey;
const NEXTAUTH_SECRET = configApi.nextAuth.secret;
const MONGODB_URI = configApi.mongodb.uri;

const providers: Provider[] = [];

if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      async profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.given_name ?? profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
  );
}

if (GITHUB_ID && GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  );
}

if (LINKEDIN_ID && LINKEDIN_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: LINKEDIN_ID,
      clientSecret: LINKEDIN_SECRET,
    }),
  );
}

if (FACEBOOK_ID && FACEBOOK_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
    }),
  );
}

// Email provider only when we have a DB connection and Resend API key
if (MONGODB_URI && RESEND_API_KEY) {
  providers.push(
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: RESEND_API_KEY,
        },
      },
      from: configProject.resend.fromNoReply,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers,
  ...(MONGODB_URI && mongoClientPromise ? { adapter: MongoDBAdapter(mongoClientPromise) } : {}),

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = ((user as { role?: string }).role as typeof token.role) ?? "user";
      }

      if (trigger === "update" && session?.user) {
        try {
          if (token.sub) {
            const dbUser = await User.findById(token.sub);
            if (dbUser) {
              token.role = dbUser.role || "user";
            }
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error("Error fetching user role:", msg);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: configProject.colors.main,
    logo: authLogoUrl,
  },
};

// Diagnostic logging
try {
  const registered = providers.map((p) => {
    const provider = p as { id?: string };
    return provider.id ?? String(p);
  });
  if (!registered.length) {
    console.warn("[next-auth] No providers registered. Check your env vars (GOOGLE_ID/GOOGLE_SECRET, etc.).");
  } else {
    console.info("[next-auth] Registered providers:", registered);
  }
  console.info("[next-auth] NEXTAUTH_SECRET set:", !!NEXTAUTH_SECRET);
  console.info("[next-auth] MONGODB_URI set:", !!MONGODB_URI);
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[next-auth] Diagnostic logging failed:", msg);
}
