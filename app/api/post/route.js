const { NextResponse } = require("next/server");

import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";

export async function POST(req){
    try {
        
        const { uuid ,additionalLink, date, description, image, location, tags, time, title} = await req.json();

        await dbConnect()

        const newpost = await Post.create({
            organizer_id: uuid,
            title,
            description,
            location,
            picture: image,
            category: tags,
            start_date: date,
            link_other: additionalLink
        })

        if(newpost){
            return NextResponse.json(
                { newpost }
            );
        }
        
    } catch (error) {
        console.log("error", error);
    }
} 