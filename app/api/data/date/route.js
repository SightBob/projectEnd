import { dbConnect } from '@/lib/ConnectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const info = searchParams.get('type');

    await dbConnect();

    let getPost;

    if (date) {
      getPost = await Post.find({ start_date: date });
    }

    if (!getPost || getPost.length === null) {
      getPost = await Post.find(
          { type: info }
        ).sort({ start_date: -1 });
    }

    if (getPost.length === 0) {
      return NextResponse.json({
        message: "No activities found",
        getPost: []
      });
    }

    return NextResponse.json({
      getPost,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      message: "An error occurred while fetching data",
      error: error.message
    }, { status: 500 });
  }
}