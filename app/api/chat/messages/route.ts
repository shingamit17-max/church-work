import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
  }

  try {
    await dbConnect();
    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
