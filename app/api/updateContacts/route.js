const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Sender ID and Receiver ID are required" }, { status: 400 });
    }

    // Find both users
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return NextResponse.json({ error: "One or both users not found" }, { status: 404 });
    }

    // Ensure contacts is an array
    if (!Array.isArray(sender.contacts)) sender.contacts = [];
    if (!Array.isArray(receiver.contacts)) receiver.contacts = [];

    // Update contacts using $addToSet
    const updateOperations = [
      { 
        updateOne: {
          filter: { _id: senderId },
          update: { $addToSet: { contacts: receiverId } }
        }
      },
      {
        updateOne: {
          filter: { _id: receiverId },
          update: { $addToSet: { contacts: senderId } }
        }
      }
    ];

    await User.bulkWrite(updateOperations);

    // Fetch updated users
    const [updatedSender, updatedReceiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    return NextResponse.json({ 
      message: 'Contacts updated successfully',
      sender: { id: updatedSender._id, contacts: updatedSender.contacts },
      receiver: { id: updatedReceiver._id, contacts: updatedReceiver.contacts }
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating contacts:", error);
    return NextResponse.json({ message: 'Error updating contacts', error: error.message }, { status: 500 });
  }
}