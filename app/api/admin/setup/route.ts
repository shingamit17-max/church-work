import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

// Temporary route to set up the first admin user
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await dbConnect();
    
    // Convert current logged in user to admin
    await User.findByIdAndUpdate(session.user.id, {
      role: 'admin'
    });

    return NextResponse.json({ success: true, message: "You are now an admin. Please sign out and sign back in to refresh your token." });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
  }
}
