import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import jwt from "jsonwebtoken";
import User from "@/models/User";

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

    // ✅ Fetch items requested from this donor
    const items = await Item.find({
      donor: user._id,
      isRequested: true
    })
      .populate("receiver", "name email") // show who requested
      .sort({ createdAt: -1 });

    if (items.length === 0) {
      return NextResponse.json({ message: "No requested items for this donor" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch requested items for donor" },
      { status: err.status || 500 }
    );
  }
}
