import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/ConnectDB";
import Message from '@/models/Message'; // สมมติว่าคุณมี Message model

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
    }).sort({ timestamp: 1 }); // เรียงตามเวลาจากเก่าไปใหม่

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}