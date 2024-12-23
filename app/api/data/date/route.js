import { dbConnect } from '@/lib/ConnectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const info = searchParams.get('type');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    await dbConnect();

    let query = {};
    if (date) {
      query.start_date = date;
    } else if (info) {
      query.type = info;
    }

    // หาจำนวนรายการทั้งหมด
    const total = await Post.countDocuments(query);

    // ดึงข้อมูลตาม pagination
    let getPost = await Post.find(query)
      .sort({ start_date: -1 })
      .skip(skip)
      .limit(limit);

    if (getPost.length === 0) {
      return NextResponse.json({
        message: "No activities found",
        getPost: [],
        total: 0,
        currentPage: page,
        totalPages: 0
      });
    }

    return NextResponse.json({
      getPost,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      message: "An error occurred while fetching data",
      error: error.message
    }, { status: 500 });
  }
}