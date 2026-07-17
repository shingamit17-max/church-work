"use server";

import { signIn, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import dbConnect from "@/lib/db";
import { User as UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { UserRole } from "@/types";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const churchOrganization = formData.get("churchOrganization") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  await dbConnect();

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return { error: "Email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
    role: "unassigned",
    onboardingComplete: false,
    churchOrganization,
  });

  await user.save();

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function loginWithLinkedIn() {
  await signIn("linkedin");
}

export async function setRole(role: UserRole) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await dbConnect();
  await UserModel.findByIdAndUpdate(session.user.id, { role });
  return { success: true };
}

// DEV-ONLY SEED FUNCTION — disabled in production
export async function forceSeedAccounts() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed function is disabled in production.");
  }
  await dbConnect();
  const testAccounts = [
    { name: "Admin User", email: "admin@gracementor.com", password: "admin123", role: "admin", onboardingComplete: true },
    { name: "Mentor User", email: "mentor@gracementor.com", password: "mentor123", role: "mentor", onboardingComplete: true },
    { name: "Mentee User", email: "mentee@gracementor.com", password: "mentee123", role: "mentee", onboardingComplete: true }
  ];

  for (const acc of testAccounts) {
    const hashedPassword = await bcrypt.hash(acc.password, 10);
    const existing = await UserModel.findOne({ email: acc.email });
    if (!existing) {
      await UserModel.create({
        name: acc.name, email: acc.email, password: hashedPassword, role: acc.role, onboardingComplete: acc.onboardingComplete
      });
    } else {
      await UserModel.updateOne(
        { email: acc.email },
        { $set: { password: hashedPassword, role: acc.role, onboardingComplete: acc.onboardingComplete } }
      );
    }
  }
  return { success: true };
}
