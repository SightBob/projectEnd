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
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        return NextResponse.json({ 
            message: "Login successful",
        }, { status: 200 });

    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}