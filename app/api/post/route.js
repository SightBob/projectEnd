import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import Notification from "@/models/Notification";

export async function POST(req) {
    try {
        await dbConnect();

        const { uuid, additionalLink, start_date, start_time, end_date, end_time,description, image, location, tags, title, type, member, maxParticipants } = await req.json();
 
        const newpost = await Post.create({
            organizer_id: uuid,
            title,
            description,
            location,
            picture: image,
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

        const result = await Post.deleteOne({ '_id': idPost });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "ไม่พบโพสต์ที่ต้องการลบ" }, { status: 404 });
        }

        // ลบการแจ้งเตือนที่เกี่ยวข้องกับโพสต์
        const deleteNofi = await Notification.deleteOne({ 'postId': idPost });
        if (deleteNofi.deletedCount === 0) {
            console.warn("ไม่พบการแจ้งเตือนที่เกี่ยวข้องกับโพสต์นี้");
        }

        // ส่ง 204 No Content เมื่อลบสำเร็จ
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบโพสต์" }, { status: 500 });
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