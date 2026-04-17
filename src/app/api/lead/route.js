import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Add your own logic here:
    // - Send a welcome email via /libs/resend
    // - Save the lead to your Supabase `leads` table

    return NextResponse.json({});
  } catch (e) {
    console.error(e?.message || String(e));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
