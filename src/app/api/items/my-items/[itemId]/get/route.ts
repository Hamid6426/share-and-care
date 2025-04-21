// /api/items/my-items/[itemId]/get/route.ts (The fetch which the donor see is different than public one)

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";

async function authorize(req: NextRequest) {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) throw { status: 401, message: "Unauthorized" };

  const token = auth.replace("Bearer ", "");
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    throw { status: 403, message: "Invalid token" };
  }

  await connectToDatabase();
  const user = await User.findById(decoded.userId);
  if (!user) throw { status: 404, message: "User not found" };

  return { user, userId: decoded.userId };
}

export async function GET(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const { user, userId } = await authorize(req);
    // params should be awaited before using its properties
    const itemId = params.itemId;
      const item = await Item.findById(itemId)
      .populate("donor", "name email")
      .populate("receiver", "name email");
    if (!item) throw { status: 404, message: "Item not found" };

    if (item.donor.toString() !== userId && !["donor", "admin", "superadmin"].includes(user.role)) {
      throw { status: 403, message: "Permission denied" };
    } 

    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch item" }, { status: err.status || 500 });
  }
}

