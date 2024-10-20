import { dbConnect } from '@/lib/ConnectDB';
import Notification from '@/models/Notification';

export async function PATCH(req, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    const { userId, title, message, scheduledTime } = await req.json(); // รับค่าที่ส่งมา

    const notification = await Notification.findById(id);

    if (!notification) {
      return new Response(JSON.stringify({ error: 'Notification not found' }), { status: 404 });
    }

    // Check if the userId is already in the readed array
    if (!notification.readed.includes(userId)) {
      notification.readed.push(userId);
    }

    // อัปเดตค่าของ notification
    notification.title = title; // อัปเดต title
    notification.message = message; // อัปเดต message
    notification.scheduledTime = scheduledTime; // อัปเดต scheduledTime

    await notification.save(); // บันทึกการเปลี่ยนแปลง

    return new Response(JSON.stringify({ success: true, notification }), { status: 200 });
  } catch (error) {
    console.error('Error updating notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to update notification' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract the ID from the URL parameters

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
