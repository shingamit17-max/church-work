"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { AdminRequest } from "@/models/AdminRequest";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function submitAdminRequest(type: "PASSWORD_RESET" | "ROLE_CHANGE" | "ACCOUNT_DELETION", details?: any) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    await connectDB();
    
    // Check if there's already a pending request of this type for this user
    const existing = await AdminRequest.findOne({ user: session.user.id, type, status: "PENDING" });
    if (existing) {
      return { error: "You already have a pending request of this type." };
    }

    const request = new AdminRequest({
      user: session.user.id,
      type,
      details
    });

    await request.save();
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit request" };
  }
}

export async function getPendingRequests() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") return { error: "Unauthorized" };

    await connectDB();
    const requests = await AdminRequest.find({ status: "PENDING" })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return { requests: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    return { error: "Failed to fetch requests" };
  }
}

export async function getUserRequests() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    await connectDB();
    const requests = await AdminRequest.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    return { requests: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    return { error: "Failed to fetch requests" };
  }
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function processAdminRequest(requestId: string, status: "APPROVED" | "REJECTED") {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") return { error: "Unauthorized" };

    await connectDB();
    const request = await AdminRequest.findById(requestId);
    if (!request) return { error: "Request not found" };
    if (request.status !== "PENDING") return { error: "Request already processed" };

    if (status === "APPROVED") {
      const user = await User.findById(request.user);
      if (!user && request.type !== "ACCOUNT_DELETION") {
        return { error: "User no longer exists" };
      }

      if (request.type === "PASSWORD_RESET" && user) {
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await user.save();
        request.result = { tempPassword }; // Admin can see this temp password!
      } else if (request.type === "ROLE_CHANGE" && user) {
        user.role = request.details?.targetRole;
        await user.save();
      } else if (request.type === "ACCOUNT_DELETION") {
        await User.findByIdAndDelete(request.user);
      }
    }

    request.status = status;
    await request.save();

    revalidatePath("/dashboard/admin");
    return { success: true, result: request.result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to process request" };
  }
}
