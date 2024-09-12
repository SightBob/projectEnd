import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/ConnectDB";
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  console.log('-------- API route called. Method: GET --------');

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log('Query parameters:', { userId });

  if (!userId) {
    console.log('Error: userId is required');
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    console.log('Database connected successfully');

    console.log(`Fetching user with ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('-------- User Data --------');
    console.log(`Username: ${user.username}`);
    console.log(`User ID: ${user._id}`);
    console.log('Raw contacts data:', JSON.stringify(user.contacts, null, 2));
    console.log('Number of contacts:', user.contacts.length);

    console.log('-------- Fetching Contact Details --------');
    const contactIds = user.contacts.map(contact => 
      mongoose.Types.ObjectId.isValid(contact) ? new mongoose.Types.ObjectId(contact) : null
    ).filter(id => id !== null);

    const contactDetails = await User.find({ _id: { $in: contactIds } });

    console.log('Number of contacts fetched:', contactDetails.length);
    console.log('Contact details:');
    contactDetails.forEach((contact, index) => {
      console.log(`Contact ${index + 1}:`);
      console.log(`  ID: ${contact._id}`);
      console.log(`  Username: ${contact.username}`);
      console.log(`  First Name: ${contact.firstname}`);
      console.log(`  Last Name: ${contact.lastname}`);
      console.log(`  Email: ${contact.email}`);
      console.log(`  Profile Image: ${contact.profileImage || 'Not set'}`);
      console.log('---');
    });

    const contacts = contactDetails.map(contact => ({
      _id: contact._id.toString(),
      username: contact.username,
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email,
      profileImage: contact.profileImage
    }));

    console.log('-------- Processed Contacts --------');
    console.log(JSON.stringify(contacts, null, 2));

    console.log('-------- API Call Completed Successfully --------');

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("-------- Error in API Call --------");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}