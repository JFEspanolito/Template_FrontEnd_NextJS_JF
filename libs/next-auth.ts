import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import config from "@/config";
import connectMongo from "./mongo";
const MONGODB_URI = process.env.MONGODB_URI;
import User from "@/models/User";

// Read env vars once and conditionally add providers to avoid passing `undefined` to provider configs
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

const providers: any[] = [];

if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      async profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    })
  );
}

// Email provider only when we have a DB connection (env) and resend API key configured
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
      from: config.resend.fromNoReply,
    })
  );
}

export const authOptions: NextAuthOptions = {
  // Set any random key in .env.local
  secret: NEXTAUTH_SECRET,
  providers: providers,
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(MONGODB_URI && connectMongo ? { adapter: MongoDBAdapter(connectMongo) } : {}),

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Include user role in JWT token
      if (user) {
        // `user` can be an AdapterUser or our DB user - use a safe cast
        (token as any).role = (user as any)?.role ?? "user";
      }

      // Refresh user data if session is updated
      if (trigger === "update" && session?.user) {
        try {
          if (token.sub) {
            const dbUser = await User.findById(token.sub as string);
            if (dbUser) {
              (token as any).role = dbUser.role || "user";
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // token.sub may be undefined; assign with a safe cast
        (session.user as any).id = token.sub;

        // Always fetch fresh role from database when possible
        try {
          if (token.sub) {
            const dbUser = await User.findById(token.sub as string);
            (session.user as any).role = dbUser?.role ?? (token as any)?.role ?? "user";
          } else {
            (session.user as any).role = (token as any)?.role ?? "user";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          (session.user as any).role = (token as any)?.role ?? "user";
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.webp`,
  },
};

// Diagnostic logging to help debug missing providers at runtime
try {
  const registered = providers.map((p) => (p && (p as any).id ? (p as any).id : String(p)));
  if (!registered.length) {
    console.warn("[next-auth] No providers registered. Check your env vars (GOOGLE_ID/GOOGLE_SECRET, etc.).");
  } else {
    console.info("[next-auth] Registered providers:", registered);
  }
  console.info("[next-auth] NEXTAUTH_SECRET set:", !!NEXTAUTH_SECRET);
  console.info("[next-auth] MONGODB_URI set:", !!process.env.MONGODB_URI);
} catch (e) {
  console.error("[next-auth] Diagnostic logging failed:", e);
}
