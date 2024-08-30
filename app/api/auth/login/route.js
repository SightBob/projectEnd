import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        await dbConnect();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: "ไม่พบชื่อผู้ใช้นี้", field: "username" }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "รหัสผ่านไม่ถูกต้อง", field: "password" }, { status: 401 });
        }

        return NextResponse.json({ 
            message: "เข้าสู่ระบบสำเร็จ",
        }, { status: 200 });

    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", field: "general" }, { status: 500 });
    }
}