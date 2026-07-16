import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const painPoint = searchParams.get("painPoint");
    const status = searchParams.get("status") || "upcoming";
    const hostId = searchParams.get("hostId");

    const query: Record<string, unknown> = { status };

    if (domain) query.domain = domain;
    if (painPoint) query.painPointTags = painPoint;
    if (hostId) query.hostId = hostId;

    const events = await Event.find(query)
      .populate("hostId", "name image")
      .sort({ dateTime: 1 })
      .lean();

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "mentor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const data = await req.json();

    // Basic validation
    if (!data.title || !data.description || !data.domain || !data.dateTime || !data.capacity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newEvent = await Event.create({
      hostId: session.user.id,
      title: data.title,
      description: data.description,
      painPointTags: data.painPointTags || [],
      domain: data.domain,
      isFree: data.isFree ?? true,
      price: data.isFree ? 0 : (data.price || 0),
      capacity: parseInt(data.capacity, 10),
      dateTime: new Date(data.dateTime),
      status: "upcoming"
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
