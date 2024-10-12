import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import User from "@/models/User"; // Import the User model

// GET: Fetch posts with user data
export async function GET(req) {
    try {
        await dbConnect();
        
        // Fetch all posts
        const posts = await Post.find({});
        
        // Extract user IDs from posts
        const userIds = posts.map(post => post.organizer_id);
        
        // Fetch users based on the extracted IDs
        const users = await User.find({ _id: { $in: userIds } });
        
        // Create a mapping of user IDs to usernames
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.username; // Map user ID to username
        });

        // Combine posts with user data
        const postsWithUsernames = posts.map(post => ({
            ...post.toObject(), // Convert Mongoose document to plain object
            username: userMap[post.organizer_id] || post.organizer_id // Add username to post
        }));

        return NextResponse.json(postsWithUsernames, { status: 200 });
    } catch (error) {
        console.error("error", error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}

// POST: Create a new post
export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        const { title, start_date, start_time, end_date, end_time, location, description, image, additionalLink, tags, uuid, organizer_id, type, member, maxParticipants } = body;
        
        const newPost = new Post({
            title,
            start_date,
            start_time,
            end_date,
            end_time,
            location,
            description,
            image,
            additionalLink,
            tags,
            uuid,
            organizer_id,
            type,
            member,
            maxParticipants,
        });

        const savedPost = await newPost.save();

        return NextResponse.json(savedPost, { status: 201 });
    } catch (error) {
        console.error("error", error);
        return NextResponse.json({ error: "Error creating post" }, { status: 500 });
    }
}

// PUT: Update an existing post
export async function PUT(req) {
    try {
        await dbConnect();
        const { id, ...updateData } = await req.json(); // รับข้อมูลที่ส่งมา
        const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedPost) {
            return NextResponse.json({ error: "โพสต์ไม่พบ" }, { status: 404 });
        }

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตโพสต์" }, { status: 500 });
    }
}

// DELETE: Delete a post
export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        await Post.findByIdAndDelete(id);
        return NextResponse.json({ message: "โพสต์ถูกลบ" }, { status: 200 });
    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
    }
}
