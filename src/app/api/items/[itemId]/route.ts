import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params

  try {
    await connectToDatabase();
    const item = await Item.findById(itemId);

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch item" },
      { status: err.status || 500 }
    );
  }
}
