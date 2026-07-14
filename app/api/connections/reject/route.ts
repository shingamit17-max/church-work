import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";

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

    match.status = "rejected";
    await match.save();

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Failed to reject connection" }, { status: 500 });
  }
}
