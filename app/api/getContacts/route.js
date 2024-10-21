import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/ConnectDB";
import User from '@/models/User';
import Message from '@/models/Message';
import mongoose from 'mongoose';

export async function GET(request) {
  // console.log('-------- API route called. Method: GET --------');

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    console.log('Error: userId is required');
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    // console.log('Database connected successfully');

    // console.log(`Fetching user with ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // console.log('-------- User Data --------');
    // console.log(`Username: ${user.username}`);
    // console.log(`User ID: ${user._id}`);
    // console.log('Raw contacts data:', JSON.stringify(user.contacts, null, 2));
    // console.log('Number of contacts:', user.contacts.length);

    // console.log('-------- Fetching Contact Details --------');
    const contactIds = user.contacts.map(contact => 
      mongoose.Types.ObjectId.isValid(contact) ? new mongoose.Types.ObjectId(contact) : null
    ).filter(id => id !== null);

    const contactDetails = await User.find({ _id: { $in: contactIds } });

    console.log('Number of contacts fetched:', contactDetails.length);
    let unreadPersonCount = 0;

    const contactsWithDetails = await Promise.all(contactDetails.map(async (contact) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: contact._id },
          { sender: contact._id, receiver: userId }
        ]
      }).sort({ timestamp: -1 });

      console.log(`Calculating unreadCount for ${contact.username}`);
      const unreadCount = await Message.countDocuments({
  sender: contact._id,
  receiver: userId,
  read: false  // เปลี่ยนจาก { $ne: true } เป็น false
});
      // console.log(`Unread count for ${contact.username}: ${unreadCount}`);

      if (unreadCount > 0) {
        unreadPersonCount++;
      }
      // console.log(`Contact: ${contact.username}`);
      // console.log(`  Last Message: ${lastMessage ? lastMessage.text : 'No messages'}`);
      // console.log(`  Unread Count: ${unreadCount}`);

      return {
        _id: contact._id.toString(),
        username: contact.username,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        profilePicture: contact.profilePicture,
        lastMessage: lastMessage ? lastMessage.text : '',
        lastMessageTime: lastMessage ? lastMessage.timestamp : null,
        unreadCount
      };
    }));

    contactsWithDetails.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    // console.log(`Total unread person count555555555555: ${unreadPersonCount}`);
    // console.log('-------- Processed Contacts --------');
    // console.log(JSON.stringify(contactsWithDetails, null, 2));

    // console.log('-------- API Call Completed Successfully --------');

    return NextResponse.json({ contacts: contactsWithDetails ,unreadPersonCount});
  } catch (error) {
    // console.error("-------- Error in API Call --------");
    // console.error("Error details:", error);
    // console.error("Error message:", error.message);
    // console.error("Error stack:", error.stack);
    return NextResponse.json({ error: "Failed to fetch contacts" });
  }
}