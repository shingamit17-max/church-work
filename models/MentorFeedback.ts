import mongoose, { Schema } from 'mongoose';
import { PainPoint } from '@/types';

const MentorFeedbackSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, unique: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    samePainPoint: { type: Boolean, required: true },
    observedPainPoints: [{ type: String, enum: Object.values(PainPoint) }],
    notes: { type: String },
  },
  { timestamps: true }
);

MentorFeedbackSchema.index({ menteeId: 1 });

export const MentorFeedback = mongoose.models.MentorFeedback || mongoose.model('MentorFeedback', MentorFeedbackSchema);
