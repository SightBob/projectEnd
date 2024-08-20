import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import User from "@/models/User";

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

    // ถ้าทั้ง email และ username ไม่ซ้ำ
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      firstname,
      lastname,
      faculty,
      major,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        newUser,
      },
      { status: 201 }
    ); // 201 Created
  } catch (error) {
    console.log("Error ", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request",
      },
      { status: 500 }
    ); // 500 Internal Server Error
  }
}
