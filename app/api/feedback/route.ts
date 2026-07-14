import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { MentorFeedback } from "@/models/MentorFeedback";
import { Match } from "@/models/Match";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "mentor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    // Verify the mentor is actually part of this match
    const match = await Match.findById(data.matchId);
    if (!match || match.mentorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Match not found or unauthorized" }, { status: 403 });
    }

    const feedback = new MentorFeedback({
      matchId: data.matchId,
      mentorId: session.user.id,
      menteeId: match.menteeId,
      samePainPoint: data.samePainPoint,
      observedPainPoints: data.observedPainPoints || [],
      notes: data.notes,
    });

    await feedback.save();
    
    // Trigger background job to refresh match scores
    const { inngest } = await import("@/lib/inngest");
    await inngest.send({
      name: "feedback/submitted",
      data: { matchId: data.matchId, menteeId: match.menteeId.toString() },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Failed to submit feedback:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
