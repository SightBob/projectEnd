import Notification from "@/models/Notification";
import { dbConnect } from "@/lib/ConnectDB";
import { sendEventReminderEmail } from "@/lib/email";


export async function POST(request) {
  try {
    const { email, title, message, userId, postId } = await request.json();
    await dbConnect()
    await sendEventReminderEmail(email, title, message);

    const Getnotification = await Notification.findOne({ postId });
    console.log("userId: ", userId);
    // เพิ่ม userId เข้า sendEmail array ถ้ายังไม่มี
    if (!Getnotification.sendEmail.includes(userId)) {
        Getnotification.sendEmail.push(userId);
      await Getnotification.save();
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}