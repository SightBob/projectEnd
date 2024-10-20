import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();

    const getPost = await Post.findById(id);
    
    if(getPost) {
      
      const nameOrganizer = await User.findById(getPost.organizer_id);
      return NextResponse.json({
        post: {
          getPost,
          nameOrganizer
        },
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const {
      title,
      start_date,
      start_time,
      end_date,
      end_time,
      location,
      description,
      picture,
      link_other,  
      category, 
      maxParticipants: originalMaxParticipants,
      member
    } = await req.json();
    
    // กำหนดค่า maxParticipants ใหม่ตามเงื่อนไข
    const maxParticipants = member === "no" ? 0 : originalMaxParticipants;
    
    const receivedData = {
      title,
      start_date,
      start_time,
      end_date,
      end_time,
      location,
      description,
      picture,
      link_other,
      category,
      maxParticipants,  
      member
    };

    // เพิ่มเงื่อนไขสำหรับ participants
    if (member === "no") {
      receivedData.participants = [];
    }

    await dbConnect();
    const updatedPost = await Post.findByIdAndUpdate(id, receivedData, { new: true });

    return NextResponse.json({
      message: "Post updated successfully",
      receivedData: updatedPost,
      id: id
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating post: ", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message
    }, { status: 500 });
  }
}