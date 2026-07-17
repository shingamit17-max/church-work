"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User as UserModel } from "@/models/User";
import { MenteeProfile as MenteeProfileModel } from "@/models/MenteeProfile";
import { MentorProfile as MentorProfileModel } from "@/models/MentorProfile";
import type { MenteeProfile, MentorProfile } from "@/types";

export async function submitMenteeProfile(data: Partial<MenteeProfile>) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "mentee" && session.user.role !== "unassigned")) {
    return { error: "Unauthorized" };
  }

  await dbConnect();

  try {
    // 1. Create Mentee Profile
    await MenteeProfileModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        status: data.status,
        careerStage: data.careerStage,
        targetDomain: data.targetDomain,
        targetRoles: data.targetRoles,
        targetCompanies: data.targetCompanies,
        diagnosticAnswers: data.diagnosticAnswers,
        resumeUrl: data.resumeUrl,
        skills: data.skills,
        availability: data.availability,
        goal3Months: data.goal3Months,
      },
      { upsert: true, new: true }
    );

    // 2. Mark user as completed onboarding
    await UserModel.findByIdAndUpdate(session.user.id, {
      onboardingComplete: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving mentee profile:", error);
    return { error: (error as Error).message || "Failed to save profile" };
  }
}

export async function submitMentorProfile(data: Partial<MentorProfile>) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "mentor" && session.user.role !== "unassigned")) {
    return { error: "Unauthorized" };
  }

  await dbConnect();

  try {
    // 1. Create Mentor Profile
    await MentorProfileModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        company: data.company,
        currentRole: data.currentRole,
        yearsExp: data.yearsExp,
        domain: data.domain,
        specialization: data.specialization,
        helpTypes: data.helpTypes,
        painPointsCanHelp: data.painPointsCanHelp,
        menteeSeniority: data.menteeSeniority,
        availability: data.availability,
        maxMentees: data.maxMentees,
        bio: data.bio,
        shareSlug: data.shareSlug,
      },
      { upsert: true, new: true }
    );

    // 2. Mark user as completed onboarding
    await UserModel.findByIdAndUpdate(session.user.id, {
      onboardingComplete: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving mentor profile:", error);
    return { error: (error as Error).message || "Failed to save profile" };
  }
}
