
// app/api/chatBot/[id]/route.js
import { NextResponse } from "next/server";
import { dbConnect } from '@/lib/ConnectDB';
import BotMessage from "@/models/BotMessage";

export async function PATCH(req, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    const { question, answer, category, isActive } = await req.json();

    const updatedMessage = await BotMessage.findByIdAndUpdate(
      id,
      { question, answer, category, isActive },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ success: false, message: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const deletedMessage = await BotMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete message' }, { status: 500 });
  }
}