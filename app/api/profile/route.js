import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function GET(req) {
  try {
    // ตรวจสอบว่ามีการส่ง ID ผู้ใช้เข้ามาหรือไม่
    const url = new URL(req.url);
    const uid = url.searchParams.get('uid'); // ใช้ URL Search Params เพื่อดึงค่าจาก query string

    if (!uid) {
      return new NextResponse(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    await dbConnect();
    const getUser = await User.findById(uid);

    if (getUser) {
      return new NextResponse(JSON.stringify(getUser), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error in GET /api/auth/profile:", error);
    return new NextResponse(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
  }
}
