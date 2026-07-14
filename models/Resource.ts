import mongoose, { Schema } from 'mongoose';
import { PainPoint } from '@/types';

const ResourceSchema = new Schema(
  {
    sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    painPointTags: [{ type: String, enum: Object.values(PainPoint) }],
  },
  { timestamps: true }
);

ResourceSchema.index({ matchId: 1, createdAt: -1 });

export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
