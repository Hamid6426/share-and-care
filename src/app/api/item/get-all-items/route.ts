import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const filter: any = {};

  if (searchParams.get("status")) filter.status = searchParams.get("status");
  if (searchParams.get("category")) filter.category = searchParams.get("category");

  const items = await Item.find().populate("donor", "name email").populate("recipient", "name email"); 
  return NextResponse.json(items, { status: 200 });
}
