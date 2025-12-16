import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/providers-status
 * Returns boolean flags indicating whether each OAuth provider is configured.
 * Does NOT expose secrets, only checks if ID + SECRET env vars exist.
 */
export async function GET() {
  const status = {
    google: Boolean(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET),
    github: Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
    linkedin: Boolean(process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET),
    facebook: Boolean(process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET),
  };

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
