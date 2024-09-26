import { dbConnect } from '@/lib/ConnectDB';
import Notification from '@/models/Notification';
import User from '@/models/User';
import mongoose from 'mongoose';

// POST method for sending notifications
export async function POST(req) {
  try {
    const { title, message } = await req.json();
    await dbConnect();

    // Create a new notification object
    const newNotification = {
      title,
      message,
      isRead: false, // Mark as unread
      createdAt: new Date(),
    };

    // Fetch all users and push the new notification to their notification array
    const users = await User.find({});
    for (let user of users) {
      user.notifications.push(newNotification);
      await user.save();
    }

    // Also save the notification in the Notification collection if needed
    await Notification.create(newNotification);

    return new Response(JSON.stringify({ success: true, notification: newNotification }), { status: 201 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();

    // Fetch all notifications from the Notification collection
    const notifications = await Notification.find({});

    // Return the notifications as JSON
    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
  }
}

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Find user by userId and retrieve their notifications
    const user = await User.findById(userId).select('notifications');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back the notifications array
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}



export async function DELETE(req) {
  try {
    await dbConnect();

    // ดึง id ของ notification ที่ต้องการลบจาก request body
    const { id } = await req.json();

    // ลบ notification จาก Notification collection
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // ลบ notification ออกจาก notifications array ใน User
    await User.updateMany(
      { notifications: id }, // ค้นหาทุก User ที่มีการแจ้งเตือนนี้ใน array
      { $pull: { notifications: id } } // ลบการแจ้งเตือนนี้ออกจาก array
    );

    return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  const { id } = req.query;  // ดึง id ของ notification ที่ต้องการแก้ไข
  const { title, message } = req.body;  // ข้อมูลที่แก้ไข

  try {
    await dbConnect();

    // แก้ไขข้อมูล notification ที่มี id ตรงกับ id ที่ส่งมา
    const updatedNotification = await Notification.findByIdAndUpdate(id, { title, message }, { new: true });

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification updated successfully', notification: updatedNotification });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update notification' });
  }
}
