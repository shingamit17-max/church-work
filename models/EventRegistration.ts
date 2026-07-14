import mongoose, { Schema } from 'mongoose';

const EventRegistrationSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'not_required'],
      default: 'not_required',
    },
    amountPaid: { type: Number, default: 0 },
    providerOrderId: { type: String },
  },
  { timestamps: true }
);

EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
EventRegistrationSchema.index({ userId: 1 });

export const EventRegistration =
  mongoose.models.EventRegistration || mongoose.model('EventRegistration', EventRegistrationSchema);
