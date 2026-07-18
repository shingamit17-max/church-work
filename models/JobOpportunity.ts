import mongoose, { Schema, Document } from "mongoose";

export interface IJobOpportunity extends Document {
  title: string;
  company: string;
  description: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary?: string;
  skills: string[];
  postedBy: mongoose.Types.ObjectId; // Reference to User (Mentor)
  isActive: boolean;
  applications: mongoose.Types.ObjectId[]; // Array of User IDs (Mentees) who applied
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobOpportunitySchema = new Schema<IJobOpportunity>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time"
    },
    salary: { type: String },
    skills: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    applications: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const JobOpportunity =
  mongoose.models.JobOpportunity ||
  mongoose.model<IJobOpportunity>("JobOpportunity", JobOpportunitySchema);
