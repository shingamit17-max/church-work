import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/models/Testimonial";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    const testimonial = new Testimonial({
      authorId: session.user.id,
      mentorId: data.mentorId || null,
      painPoints: data.painPoints || [],
      whatHelped: data.whatHelped,
      outcome: data.outcome,
      freeText: data.freeText,
    });

    await testimonial.save();
    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Fetch only unflagged testimonials for public browsing
    const testimonials = await Testimonial.find({ flagged: false })
      .populate("authorId", "name role")
      .populate("mentorId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
