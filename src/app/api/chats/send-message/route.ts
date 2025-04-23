import { NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import { Types } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { messageSenderId, messageReceiverId, message } = body;

    // Basic validation
    if (!messageSenderId || !messageReceiverId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure IDs are valid Mongo ObjectIds
    if (!Types.ObjectId.isValid(messageSenderId) || !Types.ObjectId.isValid(messageReceiverId)) {
      return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    // Generate chatId: sorted so it's always the same for a user pair
    const chatId =
      [messageSenderId, messageReceiverId].sort().join('_');

    /*
    INFO: 
    THE SENDER ID IS RETREIVED FROM DECODED TOKEN
    THE RECEIVER ID IS RETREIVED FROM PARAMS OF A USER PROFILE PAGE
    E.G localhost:3000/userId123456789 
    For it there will be a button "Start Chat"
    E.G localhost:3000/userId123456789/chat
    */

    // Create chat message
    const newMessage = await Chat.create({
      messageSenderId,
      messageReceiverId,
      message,
      chatId,
    });

    return NextResponse.json(newMessage, { status: 201 });

  } catch (err: any) {
    console.error('Send Message Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
