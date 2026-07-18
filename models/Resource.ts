import mongoose, { Schema } from 'mongoose';
import { PainPoint } from '@/types';

const ResourceSchema = new Schema(
  {
    sharedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, default: 'other' },
    painPointTags: [{ type: String, enum: Object.values(PainPoint) }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ResourceSchema.index({ matchId: 1, createdAt: -1 });

export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
