// /app/api/notifications/route.js

import { dbConnect } from '@/lib/ConnectDB';
import Notification from '@/models/Notification';
import cron from 'node-cron';

export async function GET(req) {
  await dbConnect();

  try {
    const notifications = await Notification.find({});
    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { title, message, scheduledTime } = await req.json();

    const newNotification = {
      title,
      message,
      isRead: false,
      readed: [],
      createdAt: new Date(),
      scheduledTime: new Date(scheduledTime),
    };

    await Notification.create(newNotification);

    return new Response(JSON.stringify({ success: true, notification: newNotification }), { status: 201 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), { status: 500 });
  }
}

// Schedule a task to check for notifications to send
cron.schedule('* * * * *', async () => {
  await dbConnect();
  const now = new Date();
  try {
    const notificationsToSend = await Notification.find({
      scheduledTime: { $lte: now },
      isRead: false,
    });

    notificationsToSend.forEach(async (notification) => {
      // Logic to send the notification
      console.log(`Sending notification: ${notification.title}`);
      // Mark as sent
      notification.isRead = true;
      await notification.save();
    });
  } catch (error) {
    console.error('Error sending scheduled notifications:', error);
  }
});

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json(); // Extract the ID from the request body

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return new Response(JSON.stringify({ error: 'Notification not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Notification deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete notification' }), { status: 500 });
  }
}