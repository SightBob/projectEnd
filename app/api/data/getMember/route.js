import { dbConnect } from '@/lib/ConnectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    await dbConnect();

    const event = await Post.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}