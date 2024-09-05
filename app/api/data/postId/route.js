import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";

import Post from "@/models/Post";

export async function GET(){

    try {

    await dbConnect();

    const getPost = await Post.find();

    return NextResponse.json({
        getPost,
    })

    } catch (error) {
        console.log("Error: ", error);
    }
}