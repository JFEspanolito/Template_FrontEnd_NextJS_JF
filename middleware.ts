import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protects private routes (/dashboard/*, /admin/*).
 * Redirects unauthenticated users to the sign-in page.
 * Redirects non-admin users away from /admin/* routes.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // Not signed in → redirect to NextAuth sign-in page
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin routes require "admin" role
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
