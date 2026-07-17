import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdminRequest extends Document {
  user: mongoose.Types.ObjectId;
  type: "PASSWORD_RESET" | "ROLE_CHANGE" | "ACCOUNT_DELETION";
  status: "PENDING" | "APPROVED" | "REJECTED";
  details?: Record<string, any>;
  result?: Record<string, any>; // Used to store the generated temp password if approved
  createdAt: Date;
  updatedAt: Date;
}

const adminRequestSchema = new Schema<IAdminRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["PASSWORD_RESET", "ROLE_CHANGE", "ACCOUNT_DELETION"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "REJECTED"], 
      default: "PENDING" 
    },
    details: { type: Schema.Types.Mixed },
    result: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AdminRequest: Model<IAdminRequest> =
  mongoose.models.AdminRequest || mongoose.model<IAdminRequest>("AdminRequest", adminRequestSchema);
