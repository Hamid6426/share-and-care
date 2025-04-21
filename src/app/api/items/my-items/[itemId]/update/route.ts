import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";

async function authorize(req: NextRequest) {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }
  const token = auth.replace("Bearer ", "");
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    throw { status: 403, message: "Invalid token" };
  }

  await connectToDatabase();
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  return { user, userId: decoded.userId };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { user, userId } = await authorize(req);
    const item = await Item.findById(params.itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    // only donor or admin
    if (
      item.donor.toString() !== userId &&
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      throw { status: 403, message: "Permission denied" };
    }

    const updates = await req.json();
    Object.assign(item, updates);
    await item.save();
    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update" },
      { status: err.status || 500 }
    );
  }
}