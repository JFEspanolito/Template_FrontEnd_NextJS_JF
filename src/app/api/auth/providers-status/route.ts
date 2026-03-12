import { NextResponse } from "next/server";
import configApi from "@/data/configApi";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/providers-status
 * Returns boolean flags indicating whether each OAuth provider is configured.
 * Does NOT expose secrets, only checks if ID + SECRET env vars exist.
 */
export async function GET() {
  const status = {
    google: Boolean(configApi.oauth.google.id && configApi.oauth.google.secret),
    github: Boolean(configApi.oauth.github.id && configApi.oauth.github.secret),
    linkedin: Boolean(configApi.oauth.linkedin.id && configApi.oauth.linkedin.secret),
    facebook: Boolean(configApi.oauth.facebook.id && configApi.oauth.facebook.secret),
  };

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
