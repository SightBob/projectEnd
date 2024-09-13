import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        const totalUsers = await User.countDocuments();
        return NextResponse.json({ totalUsers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
}