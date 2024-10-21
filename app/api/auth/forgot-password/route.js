import { dbConnect } from "@/lib/ConnectDB";
import { generateResetToken } from '@/lib/auth';
import { sendResetEmail } from '@/lib/email';
import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    
    const { email } = await req.json();

    // ตรวจสอบว่า user มีอยู่จริงหรือไม่
    const user = await User.findOne({ email });

    if (!user) {
      // ส่งข้อความเดียวกันไม่ว่า email จะมีอยู่จริงหรือไม่ เพื่อความปลอดภัย
      return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' }, { status: 200 });
    }
    
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // อัพเดท user โดยใช้ Mongoose method
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // ส่ง email
    try {
      await sendResetEmail(email, resetToken);
    } catch (error) {
      console.error('Error sending reset email:', error);
      // อาจจะต้องจัดการกับ error นี้ตามความเหมาะสม เช่น ลบ token ที่สร้างไว้
    }

    return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again.' }, { status: 500 });
  }
}