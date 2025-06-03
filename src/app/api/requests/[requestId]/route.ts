// app/api/requests/[requestId]/route.ts

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/utils/mongodb";
import Request from "@/models/Request";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params; // params should be awaited before using its properties
    await connectToDatabase();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const request = await Request.findById(requestId)
      .populate("receiver", "name email profilePicture country state city")
      .populate(
        "acceptedDonor",
        "name email profilePicture country state city"
      );

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ data: request }, { status: 200 });
  } catch (error) {
    console.error("Fetch Request Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
