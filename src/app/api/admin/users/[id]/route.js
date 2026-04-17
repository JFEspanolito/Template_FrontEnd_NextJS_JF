import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";

// Requires a `profiles` table in Supabase:
// id uuid references auth.users(id), role text default 'user',
// name text, customer_id text, price_id text, has_access boolean default false

export const dynamic = "force-dynamic";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

// GET /api/admin/users/[id]
export async function GET(req, context) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data: authUser, error } = await admin.auth.admin.getUserById(id);
    if (error || !authUser?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("name, role, customer_id, price_id, has_access")
      .eq("id", id)
      .single();

    return NextResponse.json({
      id: authUser.user.id,
      email: authUser.user.email,
      createdAt: authUser.user.created_at,
      ...profile,
    });
  } catch (error) {
    console.error("Error fetching user:", error?.message || String(error));
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]
export async function PUT(req, context) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, role } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const validRoles = ["user", "admin", "editor", "moderator"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const update = { name };
    if (role) update.role = role;

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("profiles").update(update).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ id, name, role });
  } catch (error) {
    console.error("Error updating user:", error?.message || String(error));
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
