import dbConnect from "@/lib/db";
import { User as UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await dbConnect();

    const testAccounts = [
      {
        name: "Admin User",
        email: "admin@gracementor.com",
        password: "admin123",
        role: "admin",
        onboardingComplete: true
      },
      {
        name: "Mentor User",
        email: "mentor@gracementor.com",
        password: "mentor123",
        role: "mentor",
        onboardingComplete: true
      },
      {
        name: "Mentee User",
        email: "mentee@gracementor.com",
        password: "mentee123",
        role: "mentee",
        onboardingComplete: true
      }
    ];

    const results = [];

    for (const acc of testAccounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      
      const existing = await UserModel.findOne({ email: acc.email });
      if (!existing) {
        await UserModel.create({
          name: acc.name,
          email: acc.email,
          password: hashedPassword,
          role: acc.role,
          onboardingComplete: acc.onboardingComplete
        });
        results.push(`Created account: ${acc.email}`);
      } else {
        // Force update password so they can definitely log in
        await UserModel.updateOne(
          { email: acc.email },
          { $set: { password: hashedPassword, role: acc.role, onboardingComplete: acc.onboardingComplete } }
        );
        results.push(`Updated existing account password for: ${acc.email}`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
