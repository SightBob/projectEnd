// app/api/auth/resend-verification-email.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/ConnectDB';
import User from '@/models/User';
import { verifyEmail } from '@/lib/email';
import { generateResetToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    console.log("Connected to DB"); // Logging การเชื่อมต่อกับฐานข้อมูล

    const { email } = await req.json();
    console.log("Email from request:", email); // Logging อีเมลที่ส่งมา

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email); // Logging หากไม่พบ user
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (!user.verifyEmailToken || user.verifyEmailExpires < Date.now()) {
      console.log("Generating new token for user:", user.email); // Logging เมื่อสร้าง token ใหม่
      user.verifyEmailToken = generateResetToken();
      user.verifyEmailExpires = Date.now() + 3600000; 
      await user.save(); 
    }

    console.log("Sending verification email to:", email); // Logging การส่งอีเมล
    await verifyEmail(email, user.verifyEmailToken);
    console.log("Verification email sent successfully"); // Logging สำเร็จ
    return NextResponse.json({ message: 'Verification email resent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error); // Logging ข้อผิดพลาด
    return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
