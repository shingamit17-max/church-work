import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MentorProfile } from "@/models/MentorProfile";
import { MenteeProfile } from "@/models/MenteeProfile";
import { calculateMatchScore } from "@/lib/matching";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "mentee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mentorId } = await req.json();
    if (!mentorId) return NextResponse.json({ error: "Missing mentorId" }, { status: 400 });

    await dbConnect();

    // Check if match already exists
    const existingMatch = await Match.findOne({
      menteeId: session.user.id,
      mentorId,
    });

    if (existingMatch) {
      return NextResponse.json({ error: "Connection request already exists" }, { status: 400 });
    }

    // Verify mentor exists and has capacity
    const mentor = await MentorProfile.findOne({ userId: mentorId });
    if (!mentor) return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    if (mentor.currentMenteeCount >= mentor.maxMentees) {
      return NextResponse.json({ error: "Mentor is at capacity" }, { status: 400 });
    }

    // Get mentee profile to calculate match score
    const mentee = await MenteeProfile.findOne({ userId: session.user.id });
    let score = 0;
    let reason = "Manual request";
    
    if (mentee) {
      const matchResult = calculateMatchScore(mentee, mentor);
      score = matchResult.score;
      reason = "Manual request: " + matchResult.reason;
    }

    // Create new pending match
    const newMatch = new Match({
      menteeId: session.user.id,
      mentorId,
      matchScore: score,
      matchReason: reason,
      status: "pending"
    });

    await newMatch.save();

    return NextResponse.json({ success: true, match: newMatch });
  } catch (error: any) {
    console.error("Failed to send connection request:", error);
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}
