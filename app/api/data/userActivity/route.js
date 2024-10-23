// /api/getactivity/route.js
import { dbConnect } from '@/lib/ConnectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const uid = searchParams.get('uid'); 
  
      if (!uid) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }
  
      await dbConnect();
  
      // ค้นหากิจกรรมที่มี uid อยู่ใน participants
      const events = await Post.find({
        participants: uid
      })
      .populate('participants', 'name email')
      .sort({ createdAt: -1 });
  
      if (events.length === 0) {
        return NextResponse.json({ message: 'No events found for this user' }, { status: 404 });
      }
  
      return NextResponse.json({ events }, { status: 200 });
  
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
}