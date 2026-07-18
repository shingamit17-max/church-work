import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MentorProfile } from "@/models/MentorProfile";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "mentor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const matchId = formData.get("matchId");
    
    if (!matchId) return NextResponse.json({ error: "Missing matchId" }, { status: 400 });

    await dbConnect();

    const match = await Match.findById(matchId);
    if (!match || match.mentorId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Check mentor capacity
    const mentor = await MentorProfile.findOne({ userId: session.user.id });
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    if (mentor.currentMenteeCount >= mentor.maxMentees) {
      return NextResponse.json({ error: "At maximum capacity" }, { status: 400 });
    }

    match.status = "accepted";
    await match.save();

    // Trigger mentor feedback nudge background job
    const { inngest } = await import("@/lib/inngest");
    await inngest.send({
      name: "match/accepted",
      data: { matchId: matchId, mentorId: session.user.id },
    });

    // Notify Mentee
    await createNotification({
      userId: match.menteeId.toString(),
      title: "Mentorship Request Accepted!",
      message: `${session.user.name || "A mentor"} has accepted your mentorship request!`,
      type: "match",
      link: `/mentors/${mentor.shareSlug || mentor.userId.toString()}`,
    }).catch(err => console.error("Failed to notify mentee:", err));

    // Increment count
    mentor.currentMenteeCount += 1;
    await mentor.save();

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to accept connection" }, { status: 500 });
  }
}
