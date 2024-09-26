// pages/api/toggleFavorite.js
import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { dbConnect } from "@/lib/ConnectDB";

export async function POST(req) {
  await dbConnect();

  try {
    const { postId, userId } = await req.json();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" });
    }

    // Check if the user has already favorited the post
    const isFavorited = post.favorites.includes(userId);

    if (isFavorited) {
      // Remove user from favorites
      post.favorites = post.favorites.filter(fav => fav.toString() !== userId);
    } else {
      // Add user to favorites
      post.favorites.push(userId);
    }

    await post.save();
    
    return NextResponse.json({ success: true, favorites: post.favorites });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function GET(req) {
    await dbConnect();
  
    try {
      const posts = await Post.find().sort({ created_at: -1 });

      if (!posts || posts.length === 0) {
        return NextResponse.json({ success: false, message: "No posts found" });
      }
  
      return NextResponse.json({ success: true, posts });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message });
    }
}