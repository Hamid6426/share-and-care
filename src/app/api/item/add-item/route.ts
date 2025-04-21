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

export async function POST(req: NextRequest) {
  try {
    const { user, userId } = await authorize(req);
    if (user.role !== "donor" && user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    const body = await req.json();
    const item = await Item.create({ ...body, donor: userId });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
