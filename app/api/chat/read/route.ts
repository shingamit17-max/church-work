import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { matchId } = await req.json();

    if (!matchId) {
      return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
    }

    await dbConnect();

    await Message.updateMany(
      { matchId, readBy: { $ne: session.user.id } },
      { $push: { readBy: session.user.id } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}
