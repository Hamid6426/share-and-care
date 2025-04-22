// app/api/chats/[chatId]/route.ts
/*
POST /api/chats
  • parse { senderId, receiverId }
  • validate inputs & ensure no duplicate thread
  • create Chat record (chatId can be a deterministic composite of two IDs)
  • return { chatId, participants }

GET /api/chats
  • get current user from session
  • find Chat documents where user is sender or receiver
  • return list of chat summaries
*/

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth/next";

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  await connectToDatabase();
  const { chatId } = params;
  const session = await getServerSession();
  const userId = session?.user?.id;

  // 1. Validate & authorize
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const isParticipant = await Chat.exists({
    chatId,
    $or: [{ messageSenderId: userId }, { messageReceiverId: userId }]
  });
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // 2. Fetch and return messages
  const messages = await Chat.find({ chatId })
    .sort({ createdAt: 1 })
    .limit(100)
    .populate(["messageSenderId", "messageReceiverId"]);
  return NextResponse.json(messages);
}

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  await connectToDatabase();
  const { chatId } = params;
  const session = await getServerSession();
  const userId = session?.user?.id;
  const { message } = await request.json();

  // 1. Auth & validate participant
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const isParticipant = await Chat.exists({
    chatId,
    $or: [{ messageSenderId: userId }, { messageReceiverId: userId }]
  });
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // 2. Validate message
  if (!message?.trim() || message.length > 500) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // 3. Save and populate
  const doc = await Chat.create({
    messageSenderId: userId,
    messageReceiverId: /* derive the other party’s ID */,
    message: message.trim(),
    chatId
  });
  const populated = await doc.populate(["messageSenderId", "messageReceiverId"]);
  return NextResponse.json(populated, { status: 201 });
}
