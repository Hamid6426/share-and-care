import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  // 1. Authenticate
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectToDatabase();

    // Ensure user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Build Filters
    const { searchParams } = new URL(req.url);
    const filter: any = { donor: user._id }; // current user items and he is a donor

    if (searchParams.get("status")) {
      filter.status = searchParams.get("status");
    }
    if (searchParams.get("category")) {
      filter.category = searchParams.get("category");
    }

    // 3. Pagination
    const page  = parseInt(searchParams.get("page")  || "1",  10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip  = (page - 1) * limit;

    // 4. Fetch Data
    const items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("donor",    "name email")
      .populate("receiver", "name email");

    const totalItems = await Item.countDocuments(filter);

    // 5. Return
    return NextResponse.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
