"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User as UserModel } from "@/models/User";
import { MenteeProfile as MenteeProfileModel } from "@/models/MenteeProfile";
import { revalidatePath } from "next/cache";

export async function updateMenteeProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "mentee") {
    return { error: "Unauthorized" };
  }

  await dbConnect();

  try {
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const bio = formData.get("bio") as string;
    
    const currentRole = formData.get("currentRole") as string;
    const company = formData.get("company") as string;
    const highestQualification = formData.get("highestQualification") as string;
    const careerStage = formData.get("careerStage") as string;
    const targetRoles = formData.get("targetRoles") as string; // From comma separated
    const skills = formData.get("skills") as string; 
    
    // Convert targetRoles from comma-separated string to array
    const targetRolesArray = targetRoles ? targetRoles.split(",").map(s => s.trim()).filter(Boolean) : undefined;
    const skillsArray = skills ? skills.split(",").map(s => ({ name: s.trim(), confidence: 5 })) : undefined;

    // Update User Model (only name, email is likely OAuth linked)
    if (fullName) {
      await UserModel.findByIdAndUpdate(session.user.id, {
        name: fullName,
      });
    }

    const updateData: any = {
      phoneNumber,
      bio,
      careerStage,
      currentRole,
      company,
      highestQualification,
    };
    if (targetRolesArray) updateData.targetRoles = targetRolesArray;
    if (skillsArray) updateData.skills = skillsArray;

    // Update Mentee Profile
    await MenteeProfileModel.findOneAndUpdate(
      { userId: session.user.id },
      updateData,
      { new: true }
    );

    revalidatePath("/dashboard/mentee/profile");
    revalidatePath("/dashboard/mentor/profile"); // Just in case we reuse logic or sidebar needs it

    return { success: true };
  } catch (error) {
    console.error("Error updating mentee profile:", error);
    return { error: (error as Error).message || "Failed to save profile" };
  }
}
