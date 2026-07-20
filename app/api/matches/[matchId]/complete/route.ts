import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { pusherServer } from "@/lib/pusher";
import { MatchStatus } from "@/types";

export async function POST(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = await params;
  const { matchId } = resolvedParams;
  
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!matchId) {
    return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
  }

  try {
    await dbConnect();

    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.menteeId.toString() !== session.user.id && match.mentorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (match.status === MatchStatus.COMPLETED) {
      return NextResponse.json({ success: true, message: "Already completed" });
    }

    match.status = MatchStatus.COMPLETED;
    await match.save();

    // Notify clients that the match is completed
    await pusherServer.trigger(matchId, "match-completed", { matchId });

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error("Match complete error:", error);
    return NextResponse.json({ error: "Failed to mark match as completed" }, { status: 500 });
  }
}
