import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Resource } from "@/models/Resource";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "mentor" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    const resource = new Resource({
      title: data.title,
      description: data.description,
      type: data.type,
      url: data.url,
      uploadedBy: session.user.id,
      tags: [],
    });

    await resource.save();
    return NextResponse.json({ success: true, resource });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
