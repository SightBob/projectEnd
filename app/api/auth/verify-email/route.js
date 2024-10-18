import { dbConnect } from '@/lib/ConnectDB';
import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(req) {
  const { token } = await req.json();
  
  if (!token) {
    return NextResponse.json({ message: 'Token จำเป็นต้องมี.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({
      verifyEmailToken: token,
      verifyEmailExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ message: 'Token ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุแล้ว.' }, { status: 400 });
    }

    user.verifyEmail = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpires = undefined;

    await user.save();

    return NextResponse.json({ message: 'อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว.' }, { status: 200 });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการยืนยันอีเมล:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.' }, { status: 500 });
  }
}
