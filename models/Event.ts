import mongoose, { Schema } from 'mongoose';
import { PainPoint } from '@/types';

const EventSchema = new Schema(
  {
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    painPointTags: [{ type: String, enum: Object.values(PainPoint), required: true }],
    domain: { type: String, required: true },
    isFree: { type: Boolean, required: true },
    price: { type: Number }, // Only if isFree is false
    capacity: { type: Number, required: true },
    registeredCount: { type: Number, default: 0 },
    dateTime: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    paymentSplit: {
      platformFeePercent: { type: Number, default: 0 },
    },
    recurrence: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
    customQuestions: [{ type: String }],
  },
  { timestamps: true }
);

EventSchema.index({ dateTime: 1, status: 1 });
EventSchema.index({ hostId: 1 });

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
