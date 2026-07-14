import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { pusherServer } from "@/lib/pusher";
import { Match } from "@/models/Match";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { matchId, content } = await req.json();

    if (!matchId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Verify user is part of the match
    const match = await Match.findById(matchId);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    if (match.menteeId.toString() !== session.user.id && match.mentorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newMessage = new Message({
      matchId,
      senderId: session.user.id,
      content,
    });

    await newMessage.save();

    // Trigger Pusher event
    await pusherServer.trigger(matchId, "new-message", {
      id: newMessage._id,
      matchId,
      senderId: session.user.id,
      content,
      createdAt: newMessage.createdAt,
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
