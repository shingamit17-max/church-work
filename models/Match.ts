import mongoose, { Schema } from 'mongoose';
import { MatchStatus } from '@/types';

const MatchSchema = new Schema(
  {
    menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.PENDING },
    matchScore: { type: Number, required: true },
    matchReason: { type: String, required: true },
  },
  { timestamps: true }
);

MatchSchema.index({ menteeId: 1, mentorId: 1 }, { unique: true });
MatchSchema.index({ mentorId: 1, status: 1 });
MatchSchema.index({ menteeId: 1, status: 1 });

export const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
