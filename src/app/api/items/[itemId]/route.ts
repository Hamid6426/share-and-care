import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET({ params }: { params: { itemId: string } }) {
  try {
    await connectToDatabase();
    const item = await Item.findById(params.itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: err.status || 500 });
  }
}
