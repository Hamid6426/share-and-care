import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import Item from "@/models/Item";
import User from "@/models/User";
import authorize from "@/utils/authorize";

export async function POST(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const { userId } = await authorize(req);
    const userWithRole = await User.findById(userId).select("role");

    if (userWithRole.role !== "receiver") {
      throw { status: 403, message: "Access denied" };
    }

    await connectToDatabase();

    const { itemId } = await params;
    const item = await Item.findById(itemId);
    if (!item) throw { status: 404, message: "Item not found" };

    if (item.status !== "available") {
      throw { status: 400, message: "Item is not available for request" };
    }

    if (item.isRequested) throw { status: 400, message: "Item already requested" };

    // Add the user to the requesters array
    if (!item.requesters.includes(userId)) {
      item.requesters.push(userId);
    }

    item.receiver = userId;
    item.status = "requested";
    item.isRequested = true;

    await item.save();

    return NextResponse.json({ message: "Request sent", item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Request failed" }, { status: err.status || 500 });
  }
}
