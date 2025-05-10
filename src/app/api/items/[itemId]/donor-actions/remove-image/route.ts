import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import path from "path";
import { unlink } from "fs/promises";

  export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  // 1) Auth check
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = auth.replace("Bearer ", "");
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // 2) Connect & fetch both user and item
  await connectToDatabase();
  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
   const { itemId } = await params;

  const item = await Item.findById(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // 3) Permission: only donor or admin/superadmin
  if (item.donor.toString() !== decoded.userId && user.role !== "admin" && user.role !== "superadmin") {
    return NextResponse.json({ error: "Not permitted to delete images for this item" }, { status: 403 });
  }

  // 4) Parse JSON body to get image URL
  const body = await req.json();
  const { imageUrl } = body;
  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  // 5) Remove image from item.images
  const imageIndex = item.images.indexOf(imageUrl);
  if (imageIndex === -1) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  item.images.splice(imageIndex, 1);

  // 6) Delete the physical file
  const filePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await unlink(filePath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }

  await item.save();

  return NextResponse.json({ message: "Image removed" }, { status: 200 });
}