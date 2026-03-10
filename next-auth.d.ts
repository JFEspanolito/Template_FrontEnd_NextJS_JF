import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context.
   */
  interface Session {
    user: {
      /** MongoDB _id */
      id: string
      /** RBAC role: user | admin | editor | moderator */
      role: "user" | "admin" | "editor" | "moderator"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** JWT token augmented with custom fields */
  interface JWT {
    /** RBAC role stored in the token by the jwt callback */
    role?: "user" | "admin" | "editor" | "moderator"
  }
}
