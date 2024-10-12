// app/api/chatBot/route.js
import { NextResponse } from "next/server";
import BotMessage from "@/models/BotMessage";
import { dbConnect } from "@/lib/ConnectDB";

export async function GET(req) {
    await dbConnect(); // Connect to the database

    try {
        // Fetch all bot messages without filtering by isActive
        const botMessages = await BotMessage.find().sort({ category: 1 });

        // Group the questions by category
        const questionsByCategory = botMessages.reduce((acc, message) => {
            if (!acc[message.category]) {
                acc[message.category] = [];
            }
            acc[message.category].push({
                id: message._id,
                question: message.question,
                answer: message.answer,
                isActive: message.isActive
            });
            return acc;
        }, {});

        // Return success response with grouped questions
        return NextResponse.json({ success: true, data: questionsByCategory });
    } catch (error) {
        // Handle errors and return failure response
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();

        if (body.action === "search") {
            // สำหรับการค้นหาคำถามและคำตอบ (ใช้ในการคุยกับแชทบอท)
            const { questionId } = body;
            const botMessage = await BotMessage.findById(questionId);

            if (!botMessage) {
                return NextResponse.json({ success: false, message: "Question not found." });
            }

            return NextResponse.json({
                success: true,
                question: botMessage.question,
                answer: botMessage.answer,
            });
        } else if (body.action === "add") {
            // สำหรับการเพิ่มคำถามและคำตอบใหม่
            const { question, answer, category, isActive } = body;
            const newMessage = new BotMessage({ question, answer, category, isActive });
            await newMessage.save();

            return NextResponse.json({
                success: true,
                message: "New question and answer added successfully.",
                data: newMessage
            });
        } else {
            return NextResponse.json({ success: false, message: "Invalid action." });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}