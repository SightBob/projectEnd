const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import Message from '@/models/Message';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get('senderId');
  const receiverId = searchParams.get('receiverId');

  if (!senderId || !receiverId) {
    return NextResponse.json({ error: "Both senderId and receiverId are required" }, { status: 400 });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const { senderId, receiverId, currentUserId } = await request.json();

    if (!senderId || !receiverId || !currentUserId) {
      return NextResponse.json({ error: "senderId, receiverId, and currentUserId are required" }, { status: 400 });
    }

    // ตรวจสอบว่า currentUserId ตรงกับ receiverId
    if (currentUserId !== receiverId) {
      return NextResponse.json({ error: "Unauthorized to mark these messages as read" }, { status: 403 });
    }

    const result = await Message.updateMany(
      { sender: senderId, receiver: receiverId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ 
      message: 'Messages marked as read successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}