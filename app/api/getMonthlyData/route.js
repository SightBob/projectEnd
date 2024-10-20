

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB"; // เชื่อมต่อกับฐานข้อมูล
import Post from "@/models/Post"; // โมเดลโพสต์

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year"); // รับปีจาก query parameter

    try {
        await dbConnect();

        // ดึงข้อมูลโพสต์ที่ตรงกับปีที่ระบุ
        const posts = await Post.find({
            start_date: {
                $gte: new Date(`${year}-01-01`), // เริ่มต้นปี
                $lt: new Date(`${Number(year) + 1}-01-01`), // สิ้นปี
            },
        });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching monthly data:", error);
        return NextResponse.json({ error: "Error fetching monthly data" }, { status: 500 });
    }
}