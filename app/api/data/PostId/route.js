import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification";

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

export async function PUT(req) {
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

    if (updatedPost && start_time) {
      const formattedTime = start_time.replace(".", ":");

      const combinedDateTimeUTC = new Date(`${start_date}T${formattedTime}:00.000Z`);

      const adjustedDateTime = new Date(combinedDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);

      const finalDateTime = new Date(adjustedDateTime.getTime() - 1 * 24 * 60 * 60 * 1000);

      const DateTimeNotification = finalDateTime.toISOString().replace("Z", "+00:00");

      const notificationTitle = `เชิญชวนเข้าร่วมกิจกรรม "${title}"`;
      const notificationMessage = `ขอเชิญชวนนักศึกษาและบุคลากรทุกท่านเข้าร่วมกิจกรรม "${title}" ซึ่งจะจัดขึ้นในวันที่ "${start_date}" เวลา "${start_time}" เพื่อเป็นโอกาสในการเรียนรู้และแลกเปลี่ยนประสบการณ์ หวังว่าจะได้พบทุกท่านในงานนี้ครับ/ค่ะ`;

      // แทนการสร้าง notification ใหม่ ให้ค้นหา notification ที่มีอยู่แล้ว
      const existingNotification = await Notification.findOneAndUpdate(
        { postId: updatedPost._id }, // ค้นหาโดยใช้ postId
        {
          title: notificationTitle,
          message: notificationMessage,
          type: member === 'yes' ? "auto" : "manual",
          scheduledTime: DateTimeNotification
        },
        { new: true, upsert: true }
      );

      return NextResponse.json({
        notification: existingNotification,
        post: updatedPost
      }, { status: 200 });

    } else {

      return NextResponse.json({
        message: "Post updated successfully",
        post: updatedPost,
        id: id
      }, { status: 200 });

    }

  } catch (error) {
    console.error("Error updating post: ", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message
    }, { status: 500 });
  }
}
