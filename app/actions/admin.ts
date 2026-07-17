"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { MenteeProfile } from "@/models/MenteeProfile";
import { MentorProfile } from "@/models/MentorProfile";
import { UserRole } from "@/types";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Ensures the caller is an authenticated admin.
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  await requireAdmin();
  await dbConnect();

  try {
    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update role" };
  }
}

/**
 * Deletes a user and their associated profiles.
 */
export async function deleteUser(userId: string) {
  await requireAdmin();
  await dbConnect();

  try {
    // Delete the core user record
    await User.findByIdAndDelete(userId);
    
    // Delete associated profiles
    await MenteeProfile.deleteOne({ userId });
    await MentorProfile.deleteOne({ userId });
    
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
}

/**
 * Creates a new user manually from the admin dashboard.
 */
export async function createUser(data: { name: string; email: string; role: UserRole; password?: string }) {
  await requireAdmin();
  await dbConnect();

  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    let hashedPassword;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      password: hashedPassword,
      onboardingComplete: false,
    });

    revalidatePath("/dashboard/admin");
    return { success: true, user: { _id: newUser._id.toString(), name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt } };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
