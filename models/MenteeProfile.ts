import mongoose, { Schema } from 'mongoose';
import { CareerStage, DiagnosticFunnelStage, PainPoint } from '@/types';

const MenteeProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: {
      type: String,
      enum: ['unemployed', 'underemployed', 'employed-but-searching'],
      required: true,
    },
    careerStage: { type: String, enum: Object.values(CareerStage), required: true },
    targetDomain: { type: String, required: true },
    targetRoles: [{ type: String, required: true }],
    targetCompanies: [{ type: String }],
    diagnosticAnswers: {
      funnelStage: { type: String, enum: Object.values(DiagnosticFunnelStage), required: true },
      painPoints: [{ type: String, enum: Object.values(PainPoint), required: true }],
      interviewCount: { type: Number, required: true },
    },
    resumeUrl: { type: String },
    skills: [
      {
        name: { type: String, required: true },
        confidence: { type: Number, min: 1, max: 10, required: true },
      },
    ],
    availability: {
      hoursPerWeek: { type: Number, required: true },
      preferredMode: { type: String, enum: ['async', 'calls', 'workshops'], required: true },
    },
    goal3Months: { type: String, required: true },
    customAnswers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'CustomQuestion' },
        answer: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

export const MenteeProfile = mongoose.models.MenteeProfile || mongoose.model('MenteeProfile', MenteeProfileSchema);
