import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "mentee") {
      return NextResponse.json({ success: false, error: "Only mentees can register for events" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    if (event.registeredCount >= event.capacity) {
      return NextResponse.json({ success: false, error: "Event is at capacity" }, { status: 400 });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId: id,
      userId: session.user.id
    });

    if (existingRegistration) {
      return NextResponse.json({ success: false, error: "Already registered for this event" }, { status: 400 });
    }

    // Note: Payment deferred to Phase 16, marking as pending if not free
    const paymentStatus = event.isFree ? "not_required" : "pending";

    const registration = await EventRegistration.create({
      eventId: id,
      userId: session.user.id,
      paymentStatus,
      amountPaid: 0 // Mocked for now
    });

    // Increment registered count
    await Event.findByIdAndUpdate(id, { $inc: { registeredCount: 1 } });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
