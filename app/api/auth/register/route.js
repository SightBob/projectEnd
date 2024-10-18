import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { generateResetToken } from "@/lib/auth";
import { verifyEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await dbConnect();

    const { username, email, password, firstname, lastname, faculty, major } = await req.json();

    // ตรวจสอบ username
    const findUsername = await User.findOne({ username }).select("_id");
    if (findUsername) {
      return NextResponse.json(
        {
          message: "Username already exists",
          field: "username",
        },
        { status: 409 }
      );
    }

    // ตรวจสอบ email
    const findEmail = await User.findOne({ email }).select("_id");
    if (findEmail) {
      return NextResponse.json(
        {
          message: "Email already exists",
          field: "email",
        },
        { status: 409 }
      );
    }

    // แฮชรหัสผ่าน
    const hashPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      firstname,
      lastname,
      faculty,
      major,
    });

    const verifyEmailToken = generateResetToken();
    const verifyEmailExpires = new Date(Date.now() + 3600000); // หมดอายุใน 1 ชั่วโมง

    // อัปเดตผู้ใช้ในฐานข้อมูลด้วย token และเวลาหมดอายุ
    newUser.verifyEmailToken = verifyEmailToken;
    newUser.verifyEmailExpires = verifyEmailExpires;
    
    await newUser.save();

    // ส่ง email
    try {
      await verifyEmail(email, verifyEmailToken);
    } catch (error) {
      console.error('Error sending reset email:', error);

      newUser.verifyEmailToken = undefined;
      newUser.verifyEmailExpires = undefined;
      await newUser.save();
      return NextResponse.json(
        {
          message: "User created but failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully. Verification email sent.",
        newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    console.log("Error ", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
