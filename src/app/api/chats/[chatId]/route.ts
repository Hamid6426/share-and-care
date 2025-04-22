// app/api/chats/route.ts
/*
GET /api/chats/[chatId]
  • auth & ensure current user in this chat
  • fetch last N messages sorted by createdAt

POST /api/chats/[chatId]
  • auth & ensure current user in this chat
  • parse { message }
  • validate length & content
  • save Chat entry linking to chatId
  • populate sender/receiver for client
*/
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth/next"; // or your auth lib

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const { senderId, receiverId } = body;

  // 1. Validate inputs
  if (!senderId || !receiverId) {
    return NextResponse.json({ error: "Missing sender or receiver" }, { status: 400 });
  }

  // 2. Compute or generate chatId (e.g., sorted combination)
  const chatId = [senderId, receiverId].sort().join("_");

  // 3. Prevent duplicate threads
  const exists = await Chat.findOne({ chatId });
  if (exists) {
    return NextResponse.json({ chatId }, { status: 200 });
  }

  // 4. Create new Chat thread (you might also store participants array)
  await Chat.create({ messageSenderId: senderId, messageReceiverId: receiverId, message: "", chatId });
  return NextResponse.json({ chatId }, { status: 201 });
}

export async function GET(request: Request) {
  await connectToDatabase();

  // 1. Enforce authentication
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // 2. Find all chat threads involving current user
  const threads = await Chat.aggregate([
    { $match: { $or: [
        { messageSenderId: userId },
        { messageReceiverId: userId }
    ]}},
    { $group: { _id: "$chatId", participants: { $addToSet: "$messageReceiverId" } } }
  ]);

  return NextResponse.json(threads);
}
