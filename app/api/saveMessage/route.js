//app/api/saveMessage/route.js
const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import Message from '@/models/Message';

// ใน /api/saveMessage/route.js
export async function POST(req) {
  try {
    await dbConnect();

    const { text, sender, receiver, timestamp } = await req.json();

    // เพิ่ม logging เพื่อตรวจสอบข้อมูลที่ได้รับ
    console.log("Received data:", { text, sender, receiver, timestamp });

    // ตรวจสอบว่าทุก field มีค่า
    if (!text || !sender || !receiver || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = new Message({
      text,
      sender,
      receiver,
      timestamp
    });

    const savedMessage = await newMessage.save();
    console.log("Saved message:", savedMessage);

    return NextResponse.json({ message: 'Message saved successfully', data: savedMessage }, { status: 201 });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ message: 'Error saving message', error: error.message }, { status: 500 });
  }
}