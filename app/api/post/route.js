import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
    try {
        await dbConnect();

        const { uuid, additionalLink, start_date, start_time, end_date, end_time,description, image, location, tags, title, type, member, maxParticipants, public_id } = await req.json();
 
        const newpost = await Post.create({
            organizer_id: uuid,
            title,
            description,
            location,
            picture: image,
            public_id,
            category: tags,
            start_date,
            start_time,
            end_date,
            end_time,
            type,
            member, 
            maxParticipants,
            link_other: additionalLink
        });
        

        if(newpost && start_time){

            const formattedTime = start_time.replace(".", ":");

            const combinedDateTimeUTC = new Date(`${start_date}T${formattedTime}:00.000Z`);

            const adjustedDateTime = new Date(combinedDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);

            const finalDateTime = new Date(adjustedDateTime.getTime() - 1 * 24 * 60 * 60 * 1000);

            const DateTimeNotification = finalDateTime.toISOString().replace("Z", "+00:00");

            const notificationTitle = `เชิญชวนเข้าร่วมกิจกรรม "${title}"`;
            const notificationMessage = `ขอเชิญชวนนักศึกษาและบุคลากรทุกท่านเข้าร่วมกิจกรรม "${title}" ซึ่งจะจัดขึ้นในวันที่ "${start_date}" เวลา "${start_time}" เพื่อเป็นโอกาสในการเรียนรู้และแลกเปลี่ยนประสบการณ์ หวังว่าจะได้พบทุกท่านในงานนี้ครับ/ค่ะ`;

            const newNotification = await Notification.create({
                title: notificationTitle,
                message: notificationMessage,
                type: member === 'yes' ? "auto" : "manual",
                isRead: false,
                postId: newpost._id,
                readed: [],
                createdAt: new Date(),
                scheduledTime: DateTimeNotification
            })

            return NextResponse.json({
                newNotification,
                newpost
            }, { status: 201 })
            
        }else {

            return NextResponse.json({
                newpost
            }, { status: 201 })

        }

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างโพสต์" }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        await dbConnect();

        const idPost = req.nextUrl.searchParams.get('id');

        if (!idPost) {
            return NextResponse.json({ error: "ไม่พบ ID ของโพสต์" }, { status: 400 });
        }

        // ค้นหาโพสต์ก่อนลบ
        const post = await Post.findById(idPost);
        
        if (!post) {
            return NextResponse.json({ error: "ไม่พบโพสต์ที่ต้องการลบ" }, { status: 404 });
        }

        // ถ้ามีรูปภาพและ public_id ให้ลบออกจาก Cloudinary
        if (post.picture && post.public_id) {
            try {
                // ใช้ public_id โดยตรงจากฐานข้อมูล
                const result = await cloudinary.uploader.destroy(post.public_id);
                
                if (result.result !== 'ok') {
                    console.warn("ไม่สามารถลบรูปภาพจาก Cloudinary ได้:", result);
                }
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
                // ส่ง warning แต่ยังดำเนินการลบโพสต์ต่อ
                return NextResponse.json({ 
                    warning: "ลบโพสต์สำเร็จแต่ไม่สามารถลบรูปภาพได้",
                    details: cloudinaryError.message 
                }, { status: 207 }); // Status 207 Multi-Status
            }
        }

        // ลบโพสต์และการแจ้งเตือนที่เกี่ยวข้อง
        await Promise.all([
            Post.deleteOne({ '_id': idPost }),
            Notification.deleteOne({ 'postId': idPost })
        ]);

        return NextResponse.json({ 
            message: "ลบโพสต์และรูปภาพสำเร็จ" 
        }, { status: 200 });

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ 
            error: "เกิดข้อผิดพลาดในการลบโพสต์",
            details: error.message 
        }, { status: 500 });
    }
}

export async function GET(){
    try {
        
        await dbConnect();

        const getAllPost = await Post.find();
        
        if(!getAllPost){
            return NextResponse.json({
                message: 'no post in database',
            },{ status: 404 });
        }

        return NextResponse.json({
            getAllPost,
        },{ status: 201 });

    } catch (error) {
        console.log("Error get all post: ", error);
    }
}