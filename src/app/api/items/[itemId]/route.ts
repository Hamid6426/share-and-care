import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params; // params should be awaited before using its properties
    const item = await Item.findById(itemId).populate("donor", "name email").populate("receiver", "name email");
    if (!item) throw { status: 404, message: "Item not found" };

    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch item" }, { status: err.status || 500 });
  }
}

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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { user, userId } = await authorize(req);
    const { itemId } = await params;
    const item = await Item.findById(itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    if (item.donor.toString() !== userId && !["admin", "superadmin"].includes(user.role)) {
      throw { status: 403, message: "Permission denied" };
    }

    await item.deleteOne();
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete item" }, { status: err.status || 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { user, userId } = await authorize(req);
    const { itemId } = await params;
    const item = await Item.findById(itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    // only donor or admin
    if (item.donor.toString() !== userId && user.role !== "admin" && user.role !== "superadmin") {
      throw { status: 403, message: "Permission denied" };
    }

    const updates = await req.json();
    Object.assign(item, updates);
    await item.save();
    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: err.status || 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { user, userId } = await authorize(req);
    const { itemId } = await params;
    const item = await Item.findById(itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    // only donor or admin
    if (item.donor.toString() !== userId && user.role !== "admin" && user.role !== "superadmin") {
      throw { status: 403, message: "Permission denied" };
    }

    const patches = await req.json();
    Object.assign(item, patches);
    await item.save();
    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: err.status || 500 });
  }
}
