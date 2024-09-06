import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();

    const getPost = await Post.findById(id);

    if (!getPost) {
      return NextResponse.json({
        message: "no data",
      }, { status: 404 }); // ใช้ 404 สำหรับ "Not Found" แทน 401
    }

    return NextResponse.json({
      post: getPost,
    }, { status: 200 }); // ใช้ 200 สำหรับ "OK" แทน 201

  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
}