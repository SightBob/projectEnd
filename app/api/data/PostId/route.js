import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import User from "@/models/User"; // Import User model

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();

    // ดึงข้อมูล post จาก Posts_col
    const getPost = await Post.findById(id);
    if (!getPost) {
      return NextResponse.json({
        message: "no data",
      }, { status: 404 });
    }

    // ดึงข้อมูล organizer จาก Users_col โดยใช้ organizer_id
    const organizer = await User.findById(getPost.organizer_id);
    if (!organizer) {
      return NextResponse.json({
        message: "Organizer not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      post: getPost,
      organizer: organizer.username, // ส่ง username กลับไปพร้อมกับข้อมูล post
    }, { status: 200 });

  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
