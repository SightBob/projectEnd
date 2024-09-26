import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";

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

        return NextResponse.json({ newpost }, { status: 201 });
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

        // ส่ง 204 No Content เมื่อลบสำเร็จ
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบโพสต์" }, { status: 500 });
    }
}