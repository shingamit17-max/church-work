import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { MenteeProfile } from "@/models/MenteeProfile";
import { MentorProfile } from "@/models/MentorProfile";
import { Match } from "@/models/Match";
import { rankMentors } from "@/lib/matching";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "mentee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const mentee = await MenteeProfile.findOne({ userId: session.user.id });
    if (!mentee) {
      return NextResponse.json({ error: "Mentee profile not found" }, { status: 404 });
    }

    // Fetch all available mentors
    // In a real app at scale, this would be a pre-filtered query or use Atlas Search.
    // For MVP, fetch all and filter/rank in memory.
    const mentors = await MentorProfile.find({
      $expr: { $lt: ["$currentMenteeCount", "$maxMentees"] }
    });

    const rankedMatches = rankMentors(mentee, mentors, 4);

    if (rankedMatches.length === 0) {
      return NextResponse.json({ success: true, message: "No available mentors found at this time." });
    }

    // Check existing matches to avoid duplicates
    const existingMatches = await Match.find({ menteeId: session.user.id });
    const existingMentorIds = new Set(existingMatches.map(m => m.mentorId.toString()));

    const newMatchesToInsert = rankedMatches
      .filter(rm => !existingMentorIds.has(rm.mentorId))
      .map(rm => ({
        menteeId: session.user.id,
        mentorId: rm.mentorId,
        matchScore: rm.score,
        matchReason: rm.reason,
        status: "pending"
      }));

    if (newMatchesToInsert.length > 0) {
      await Match.insertMany(newMatchesToInsert);
    }

    return NextResponse.json({ success: true, count: newMatchesToInsert.length });
  } catch (error: any) {
    console.error("Match generation error:", error);
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 });
  }
}
