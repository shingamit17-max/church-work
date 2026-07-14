import mongoose, { Schema } from 'mongoose';
import { CareerStage, PainPoint } from '@/types';

const MentorProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    company: { type: String, required: true },
    currentRole: { type: String, required: true },
    yearsExp: { type: Number, required: true },
    domain: { type: String, required: true },
    specialization: { type: String, required: true },
    helpTypes: [{ type: String, enum: ['1:1', 'resume', 'mock', 'resource', 'workshop', 'guidance'], required: true }],
    painPointsCanHelp: [{ type: String, enum: Object.values(PainPoint), required: true }],
    menteeSeniority: [{ type: String, enum: Object.values(CareerStage), required: true }],
    availability: {
      hoursPerMonth: { type: Number, required: true },
      preferredMode: { type: String, enum: ['async', 'calls', 'workshops'], required: true },
    },
    maxMentees: { type: Number, required: true },
    currentMenteeCount: { type: Number, default: 0 },
    bio: { type: String, required: true },
    shareSlug: { type: String, required: true, unique: true },
    impactStats: {
      menteesHelped: { type: Number, default: 0 },
      workshopsHosted: { type: Number, default: 0 },
      testimonialsReceived: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for text search
MentorProfileSchema.index({ domain: 'text', specialization: 'text', bio: 'text' });

export const MentorProfile = mongoose.models.MentorProfile || mongoose.model('MentorProfile', MentorProfileSchema);
