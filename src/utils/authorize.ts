import { NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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
  
  // Only fetch the fields you need (e.g., `_id` for validation)
  const user = await User.findById(decoded.userId).select("_id");
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Return ONLY what's necessary (avoid full user object)
  return { userId: decoded.userId };
}

export default authorize;