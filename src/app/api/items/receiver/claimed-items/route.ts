// src/app/api/items/receiver/claimed-items/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const auth    = req.headers.get("Authorization") || "";
    const token   = auth.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId  = decoded.userId;

    // 2. Connect + user check
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };

    // 3. Query
    const items = await Item.find({ receiver: userId, status: "claimed" })
      .populate("donor", "name email")
      .populate("receiver", "name email");

    // 4. Return
    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
