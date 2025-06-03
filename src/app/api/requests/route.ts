// app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/Request"; // updated name
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import authorize from "@/utils/authorize";

// POST: Create a new request /api/requests
export async function POST(req: NextRequest) {
  try {
    const { userId } = await authorize(req);
    const userWithRole = await User.findById(userId).select("role");

    if (userWithRole.role !== "receiver") {
      throw { status: 403, message: "Access denied" };
    }
    await connectToDatabase();

    const { title, description, category, tags } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRequest = await Request.create({
      title,
      description,
      category,
      tags: tags || [],
      receiver: userId,
    });

    return NextResponse.json(
      { message: "Request created", data: newRequest },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Request Creation Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: /api/requests?status=open&category=Clothing&tags=warm,school&search=shoes
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const filters: any = {};

    // ── Filter: Status ───────────────────────────────────────────────────────
    const status = searchParams.get("status");
    if (status) filters.status = status;

    // ── Filter: Category ─────────────────────────────────────────────────────
    const category = searchParams.get("category");
    if (category) filters.category = category;

    // ── Filter: Tags (partial match, any of provided tags) ───────────────────
    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      const tagsArray = tagsParam.split(",").map((tag) => tag.trim());
      filters.tags = { $in: tagsArray };
    }

    // ── Filter: Receiver ─────────────────────────────────────────────────────
    const receiver = searchParams.get("receiver");
    if (receiver) filters.receiver = receiver;

    // ── Full Text Search in Title & Description ──────────────────────────────
    const search = searchParams.get("search");
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // --
    const limit = parseInt(searchParams.get("limit") || "10", 10); // default 10
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;
    const safeLimit = Math.min(limit, 50); // don't allow more than 50 per page

    // ── Query DB ─────────────────────────────────────────────────────────────
    const requests = await Request.find(filters)
      .populate("receiver", "name email profilePicture country state city") // limit fields
      .populate("acceptedDonor", "name email profilePicture country state city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    const total = await Request.countDocuments(filters);

    return NextResponse.json(
      {
        data: requests,
        pagination: {
          total,
          page,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Request Filter Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
