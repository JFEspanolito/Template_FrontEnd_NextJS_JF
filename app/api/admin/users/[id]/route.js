import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectMongo } from "@/libs/db";
import User from "@/models/User";

// Prevent caching
export const dynamic = "force-dynamic";

// GET /api/admin/users/[id]
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findById(id).select("name email role createdAt lastLogin").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error?.message || String(error));
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, role } = body;

    // Basic validations
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate role
    const validRoles = ["user", "admin", "editor", "moderator"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    user.name = name;
    if (role) user.role = role;
    await user.save();

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error updating user:", error?.message || String(error));
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
