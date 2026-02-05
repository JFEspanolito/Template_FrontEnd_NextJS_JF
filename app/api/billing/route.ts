import { NextResponse } from "next/server";
import { generateInvoiceUseCase } from "@/core/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, taxId } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    const invoice = await generateInvoiceUseCase.execute({
      userId: session.user.id,
      userEmail: session.user.email || "",
      items: items,
      taxId: taxId,
    });

    return NextResponse.json({
      success: true,
      data: invoice.toPrimitives(),
    });
  } catch (error: any) {
    console.error("Billing Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
