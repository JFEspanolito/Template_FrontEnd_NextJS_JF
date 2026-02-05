import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** El ID del usuario en tu base de datos (Mongo _id) */
      id: string
    } & DefaultSession["user"]
  }
}