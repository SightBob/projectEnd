import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json({
        message: "Post not found"
      }, { status: 404 });
    }

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
      member,
      public_id,
      description_image_ids = [],
      register_start_date,
      register_start_time,
      register_end_date,
      register_end_time
    } = await req.json();

    if (picture !== existingPost.picture) {
      if (existingPost.public_id) {
        try {
          await cloudinary.uploader.destroy(existingPost.public_id);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    const oldDescriptionImageIds = existingPost.description_image_ids || [];
    const imagesToDelete = oldDescriptionImageIds.filter(
      oldId => !description_image_ids.includes(oldId)
    );

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(imageId =>
        cloudinary.uploader.destroy(imageId)
      );
      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error deleting old description images:", error);
      }
    }

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
      member,
      public_id,
      description_image_ids,
      register_start_date: member === "yes" ? register_start_date : null,
      register_start_time: member === "yes" ? register_start_time : null,
      register_end_date: member === "yes" ? register_end_date : null,
      register_end_time: member === "yes" ? register_end_time : null
    };

    if (member === "no") {
      receivedData.participants = [];
      receivedData.register_start_date = null;
      receivedData.register_start_time = null;
      receivedData.register_end_date = null;
      receivedData.register_end_time = null;
    }

    await dbConnect();
    const updatedPost = await Post.findByIdAndUpdate(id, receivedData, { new: true });

    if (updatedPost && member === "yes" && register_start_date && register_start_time) {
      const registerDateTime = new Date(`${register_start_date}T${register_start_time}:00.000Z`);
      const notifyBeforeRegister = new Date(registerDateTime.getTime() - (24 * 60 * 60 * 1000));
      const registerNotificationTime = notifyBeforeRegister.toISOString().replace("Z", "+00:00");

      const registerNotificationTitle = `เปิดรับสมัครเข้าร่วมกิจกรรม "${title}"`;
      const registerNotificationMessage = `กิจกรรม "${title}" จะเปิดรับสมัครในวันที่ ${register_start_date} เวลา ${register_start_time} น. จำนวนที่รับสมัคร ${maxParticipants} คน`;

      await Notification.findOneAndUpdate(
        { 
          postId: updatedPost._id,
          type: "register_notification" 
        },
        {
          title: registerNotificationTitle,
          message: registerNotificationMessage,
          type: "register_notification",
          isRead: false,
          scheduledTime: registerNotificationTime
        },
        { upsert: true, new: true }
      );
    }

    if (updatedPost && start_time) {
      const formattedTime = start_time.replace(".", ":");
      const combinedDateTimeUTC = new Date(`${start_date}T${formattedTime}:00.000Z`);
      const adjustedDateTime = new Date(combinedDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);
      const finalDateTime = new Date(adjustedDateTime.getTime() - 1 * 24 * 60 * 60 * 1000);
      const DateTimeNotification = finalDateTime.toISOString().replace("Z", "+00:00");

      const notificationTitle = `เชิญชวนเข้าร่วมกิจกรรม "${title}"`;
      const notificationMessage = `ขอเชิญชวนนักศึกษาและบุคลากรทุกท่านเข้าร่วมกิจกรรม "${title}" ซึ่งจะจัดขึ้นในวันที่ "${start_date}" เวลา "${start_time}" เพื่อเป็นโอกาสในการเรียนรู้และแลกเปลี่ยนประสบการณ์ หวังว่าจะได้พบทุกท่านในงานนี้ครับ/ค่ะ`;

      const existingNotification = await Notification.findOneAndUpdate(
        { 
          postId: updatedPost._id,
          type: { $ne: "register_notification" }
        },
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
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post: updatedPost,
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
