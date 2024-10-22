import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/ConnectDB';
import User from '@/models/User';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId).select('username email firstname lastname major');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      major: user.major
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    // เพิ่มการตรวจสอบประเภทของ error
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}