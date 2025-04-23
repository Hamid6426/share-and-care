// /api/items/[itemId]/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import Item from "@/models/Item";
import User from "@/models/User";

export async function POST(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) throw { status: 401, message: "Unauthorized" };

    const token = auth.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };

    if (user.role !== "receiver") {
      throw { status: 403, message: "Only receivers can request items" };
    }

    const itemId = params.itemId;

    const item = await Item.findById(itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    if (item.isRequested) throw { status: 400, message: "Item already requested" };

    item.receiver = userId;
    item.status = "requested";
    item.isRequested = true;

    await item.save();

    return NextResponse.json({ message: "Request sent", item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Request failed" }, { status: err.status || 500 });
  }
}
