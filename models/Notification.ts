import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string; // The ID of the user receiving the notification
  title: string;
  message: string;
  type: "event" | "match" | "system";
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["event", "match", "system"], required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
