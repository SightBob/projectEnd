import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";

export async function GET(req){

    try {
        const { searchParams } = new URL(req.url);
        const Userid = searchParams.get('Userid');

        await dbConnect();

        if(!Userid){
            return NextResponse.json({
                message: "login pls",
            });
        }
        const getPost = await Post.find({ organizer_id: Userid });

        return NextResponse.json({
            getPost,
        });


    } catch (error) {
        console.log("Error get by user id: ", error);
    }

}