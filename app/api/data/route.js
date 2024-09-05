import { dbConnect } from '@/lib/ConnectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {

  try {
    
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    await dbConnect();

    const getPost = await Post.find({ start_date: date });

    if(!getPost){
      return NextResponse.json({
        message: "no activity",
      })
    }

    return NextResponse.json({
      getPost,
    })

  } catch (error) {
    console.log("error: ", error);
  }

}
