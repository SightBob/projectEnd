//app/api/saveMessage/route.js
const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import Message from '@/models/Message';

export async function POST(request) {
  await dbConnect();

  try {
    const { text, sender, receiver, timestamp } = await request.json();

    const newMessage = new Message({
      text,
      sender,
      receiver,
      timestamp
    });

    const savedMessage = await newMessage.save();
    return NextResponse.json({ message: 'Message saved successfully', data: savedMessage }, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}