import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User"; 

// GET: Fetch all users
export async function GET(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Fetch all users from the User collection
        const users = await User.find({}, '_id username email firstname lastname faculty major preferred_categories role');

        // Check if users exist
        if (users.length === 0) {
            return NextResponse.json({ success: false, message: "No users found" }, { status: 404 });
        }

        // Return the list of users
        return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ success: false, message: "Error fetching users" }, { status: 500 });
    }
}

// POST: Create a new user
export async function POST(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Parse the request body to get user details
        const body = await req.json();
        const { username, email, firstname, lastname, faculty, major, preferred_categories, role } = body;

        // Create a new user object
        const newUser = new User({
            username,
            email,
            firstname,
            lastname,
            faculty,
            major,
            preferred_categories,
            role,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the saved user
        return NextResponse.json({ success: true, data: savedUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, message: "Error creating user" }, { status: 500 });
    }
}

// PUT: Update an existing user
export async function PUT(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Parse the request body to get the user ID and update data
        const { id, ...updateData } = await req.json();

        // Update the user by ID
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        // Check if the user was found and updated
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Return the updated user
        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: "Error updating user" }, { status: 500 });
    }
}

// DELETE: Delete a user
export async function DELETE(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Parse the request body to get the user ID
        const { id } = await req.json();

        // Delete the user by ID
        await User.findByIdAndDelete(id);

        // Return a success message
        return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: "Error deleting user" }, { status: 500 });
    }
}
