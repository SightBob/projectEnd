// pages/api/allUser/[id].js
import { NextResponse } from "next/server";
import { dbConnect } from '@/lib/ConnectDB';
import User from "@/models/User";

export async function PATCH(req, { params }) {
    try {
        await dbConnect();
        const { id } = params; // Get the id from the URL parameters
        const updateData = await req.json(); // Get the rest of the data from the request body

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: "Error updating user" }, { status: 500 });
    }
}

// DELETE: Delete a user
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = params; // Get the id from the URL parameters

        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: "Error deleting user" }, { status: 500 });
    }
}
