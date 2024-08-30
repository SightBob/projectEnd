const { NextResponse } = require("next/server");
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";

export async function POST(req) {
    try {
        await dbConnect();
        
        const { uuid, interests } = await req.json();
        
        if (!uuid || !interests) {
            return NextResponse.json({ error: "UUID and interests are required" }, { status: 400 });
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: uuid },
            { $set: { preferred_categories: interests } },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({
            message: "User interests updated successfully",
        }, { status: 200 });
    } catch (error) {
        console.error("Request processing error:", error);
        return NextResponse.json({ error: "Failed to update user interests" }, { status: 500 });
    }
}