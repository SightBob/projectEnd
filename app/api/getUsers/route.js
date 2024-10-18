import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        
        // ดึงข้อมูล _id, username, และ preferred_categories ของผู้ใช้ทั้งหมด
        const users = await User.find({}, '_id username preferred_categories');

        // ตรวจสอบว่ามีผู้ใช้หรือไม่
        if (users.length === 0) {
            return NextResponse.json({ message: "No users found" }, { status: 404 });
        }

        // นับจำนวนผู้ใช้ทั้งหมด
        const totalUsers = users.length;

        return NextResponse.json({ totalUsers, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
}