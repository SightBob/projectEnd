// pages/api/getOnlineUsers.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB"; // เชื่อมต่อฐานข้อมูล
import User from "@/models/User"; // นำเข้าโมเดล User

export async function GET(req) {
  try {
    await dbConnect(); // เชื่อมต่อฐานข้อมูล

    // ดึงผู้ใช้ที่ออนไลน์
    const onlineUsers = await User.find({ isOnline: true });

    return NextResponse.json({ onlineUsers: onlineUsers.length }, { status: 200 }); // ส่งกลับจำนวนผู้ใช้ที่ออนไลน์
  } catch (error) {
    console.error("Error fetching online users:", error);
    return NextResponse.json({ error: "Error fetching online users" }, { status: 500 });
  }
}