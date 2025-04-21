import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import jwt from "jsonwebtoken";

/*
CREATE ALL ITEMS HANDLER AT "api/items"
*/

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);

  // Extract pagination parameters (default to page 1 and 12 items per page)
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const filter: any = {};

  if (searchParams.get("status")) filter.status = searchParams.get("status");
  if (searchParams.get("category")) filter.category = searchParams.get("category");

  // Calculate the offset for pagination
  const skip = (page - 1) * limit;

  try {
    // Fetch the items with pagination and filtering
    const items = await Item.find(filter).skip(skip).limit(limit).populate("donor", "name email").populate("receiver", "name email");

    // Get the total count of items for pagination
    const totalItems = await Item.countDocuments(filter);

    return NextResponse.json(
      {
        items,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

/*
ASYNC AUTH FUNCTION (WILL LATER MAKE IT A MIDDLEWARE BUT FOR NOW IT WORKS)
*/

async function authorize(req: NextRequest) {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    throw error;
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

/*
CREATE A NEW ITEM HANDLER AT "api/items"
*/

export async function POST(req: NextRequest) {
  try {
    const { user, userId } = await authorize(req);
    const allowedRoles = ["donor", "admin", "superadmin"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    const body = await req.json();
    if (!body.title || !body.description || !body.category || !body.condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const item = await Item.create({ ...body, donor: userId });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status });
  }
}
