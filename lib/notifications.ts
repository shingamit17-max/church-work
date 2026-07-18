import dbConnect from "@/lib/db";
import { Notification } from "@/models/Notification";
import { UserRole } from "@/types";
import { User } from "@/models/User";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: "event" | "match" | "system";
  link?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  await dbConnect();
  await Notification.create(params);
}

export async function notifyAllMentees(
  params: Omit<CreateNotificationParams, "userId">
) {
  await dbConnect();
  
  // Find all mentees
  const mentees = await User.find({ role: UserRole.MENTEE }).select("_id");
  
  // Create notifications in bulk
  if (mentees.length === 0) return;
  
  const notifications = mentees.map((mentee) => ({
    userId: mentee._id.toString(),
    ...params,
  }));
  
  await Notification.insertMany(notifications);
}
