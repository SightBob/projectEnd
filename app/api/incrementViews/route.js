
// pages/api/incrementViews.js
const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import Post from '@/models/Post'; // สมมติว่าคุณมีโมเดล Post

export async function POST(request) {
  await dbConnect();

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'No ID provided' }, { status: 400 });
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      objectId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (updatedPost) {
      return NextResponse.json({ 
        message: 'View count updated successfully', 
        views: updatedPost.views 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json({ 
      message: 'Error updating view count', 
      error: error.message 
    }, { status: 500 });
  }
}