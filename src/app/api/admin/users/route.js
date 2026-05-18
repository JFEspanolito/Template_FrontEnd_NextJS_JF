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

// GET /api/admin/users
export async function GET(req) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const search = searchParams.get("search");

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: limit });
    if (error) throw error;

    let users = data.users.map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
    }));

    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) => u.email?.toLowerCase().includes(q));
    }

    const ids = users.map((u) => u.id);
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, name, role")
      .in("id", ids);

    const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

    const enriched = users.map((u) => ({
      ...u,
      name: profileMap[u.id]?.name ?? null,
      role: profileMap[u.id]?.role ?? "user",
    }));

    return NextResponse.json({
      data: enriched,
      pagination: {
        total: data.total ?? enriched.length,
        page,
        totalPages: Math.ceil((data.total ?? enriched.length) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error?.message || String(error));
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// POST /api/admin/users
export async function POST(req) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const validRoles = ["user", "admin", "editor", "moderator"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (createError) {
      if (createError.message.includes("already")) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
      throw createError;
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: created.user.id,
      name,
      role: role || "user",
    });

    if (profileError) throw profileError;

    return NextResponse.json({ data: { id: created.user.id, email, name, role: role || "user" } });
  } catch (error) {
    console.error("Error creating user:", error?.message || String(error));
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
