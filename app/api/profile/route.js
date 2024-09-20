import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const uid = url.searchParams.get('uid');

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

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const uid = url.searchParams.get('uid');

    if (!uid) {
      return new NextResponse(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const body = await req.json();
    const { firstname, lastname, email, gender, faculty, major, username } = body;

    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { firstname, lastname, email, gender, faculty, major, username },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error in PUT /api/auth/profile:", error);
    return new NextResponse(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
  }
}