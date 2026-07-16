"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { MenteeProfile } from "@/models/MenteeProfile";
import { MentorProfile } from "@/models/MentorProfile";
import { UserRole } from "@/types";
import { revalidatePath } from "next/cache";

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
