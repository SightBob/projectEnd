import { dbConnect } from "@/lib/ConnectDB";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function POST(req) {
    try {
        await dbConnect();

        const { eventId, userId } = await req.json();

        const event = await Post.findById(eventId);

        if (!event) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }

        let message, action;

        if (event.participants.includes(userId)) {
            // User is already in the event, so remove them
            event.participants = event.participants.filter(id => id.toString() !== userId);
            message = 'Successfully unregistered from the event';
            action = 'unregistered';
        } else {
            // User is not in the event, so add them
            if (event.participants.length >= event.maxParticipants) {
                return NextResponse.json({ success: false, message: 'Event is full' }, { status: 400 });
            }
            event.participants.push(userId);
            message = 'Successfully joined the event';
            action = 'registered';
        }

        await event.save();

        const getNotification = await Notification.findOne({ postId: eventId });

        if (getNotification) {
            getNotification.participants = event.participants;
            await getNotification.save();
        }

        return NextResponse.json({ success: true, message, action }, { status: 200 });
    } catch (error) {
        console.error('Error processing event registration:', error);
        return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
