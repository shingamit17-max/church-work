import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/models/Testimonial";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    testimonial.flagged = true;
    await testimonial.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to flag testimonial:", error);
    return NextResponse.json({ error: "Failed to flag testimonial" }, { status: 500 });
  }
}
