import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw error;

    return NextResponse.json({ data: { usersCount: data.total ?? 0 } });
  } catch (error) {
    console.error("Error fetching dashboard data:", error?.message || String(error));
    return NextResponse.json({ error: "Error fetching dashboard data" }, { status: 500 });
  }
}
