import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import jwt from "jsonwebtoken";
import User from "@/models/User";

// GET handler to fetch all items with isRequested = true
export async function GET(req: NextRequest) {
  try {
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

    // Fetch all items where isRequested = true
    const items = await Item.find({ isRequested: true })
      .populate("donor", "name email") // Optionally populate donor details
      .populate("receiver", "name email") // Optionally populate receiver details
      .sort({ createdAt: -1 }); // Sort items by creation date (or other sorting logic)

    // If no items are found
    if (items.length === 0) {
      return NextResponse.json({ message: "No requested items found" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch requested items" }, { status: err.status || 500 });
  }
}