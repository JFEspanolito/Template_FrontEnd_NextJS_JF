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

interface GoogleProfile extends Profile {
  sub: string;
  given_name?: string;
  picture?: string;
}

// Read env vars once and conditionally add providers
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const LINKEDIN_ID = process.env.LINKEDIN_ID;
const LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;
const FACEBOOK_ID = process.env.FACEBOOK_ID;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";
const MONGODB_URI = process.env.MONGODB_URI;

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
      from: configApi.resend.fromNoReply,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers,
  ...(MONGODB_URI && mongoClientPromise
    ? { adapter: MongoDBAdapter(mongoClientPromise) }
    : {}),

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: string }).role as typeof token.role ?? "user";
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
    logo:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/logoAndName.webp"
        : `https://${configProject.domainName}/logoAndName.webp`,
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
