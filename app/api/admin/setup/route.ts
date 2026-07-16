import { NextResponse } from "next/server";

// This route has been disabled for security reasons.
export async function GET(req: Request) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
