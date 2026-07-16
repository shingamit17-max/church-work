import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const isMentee = session.user.role === "mentee";
    const query = isMentee 
      ? { menteeId: session.user.id }
      : { mentorId: session.user.id };

    // In a full implementation, we'd populate the mentor/mentee profile details here.
    // For MVP, we populate basic user info. We might need to populate from MentorProfile/MenteeProfile too.
    const matches = await Match.find(query)
      .populate(isMentee ? "mentorId" : "menteeId", "name email image")
      .sort({ matchScore: -1, createdAt: -1 });

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error("Fetch matches error:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
