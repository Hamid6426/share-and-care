import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import authorize from "@/utils/authorize";

// GET handler to fetch all items with isRequested = true
export async function GET(req: NextRequest) {
  try {
    const { userId } = await authorize(req);
    const userWithRole = await User.findById(userId).select("role");

    if (userWithRole.role !== "donor") {
      throw { status: 403, message: "Access denied" };
    }
    await connectToDatabase();

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