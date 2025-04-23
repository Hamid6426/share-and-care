

// import { NextResponse } from 'next/server';
// import Chat from '@/models/Chat';
// import { Types } from 'mongoose';
// import connectToDatabase from '@/lib/mongodb';

// export async function POST(req: Request) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const { senderId, receiverId } = body;

//     // Basic validation
//     if (!senderId || !receiverId) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(receiverId)) {
//       return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
//     }

//     const chatId = [senderId, receiverId].sort().join('_');

//     // Check if chat exists
//     let chat = await Chat.findOne({ chatId });

//     if (!chat) {
//       chat = await Chat.create({
//         chatId,
//         messageSenderId: senderId,
//         messageReceiverId: receiverId,
//         messages: [], // Optional: if you want to store array
//         createdAt: new Date(),
//       });
//     }

//     return NextResponse.json(chat, { status: 200 });

//   } catch (err: any) {
//     console.error('Start Chat Error:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
