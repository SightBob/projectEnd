import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        
        // ดึงข้อมูล preferred_categories ของผู้ใช้ทั้งหมด
        const users = await User.find({}, 'preferred_categories');

        // นับจำนวนผู้ใช้ทั้งหมด
        const totalUsers = users.length;

        return NextResponse.json({ totalUsers, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
}
