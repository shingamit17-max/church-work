import mongoose, { Schema } from 'mongoose';
import { PainPoint } from '@/types';

const TestimonialSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional tag-back
    painPoints: [{ type: String, enum: Object.values(PainPoint), required: true }],
    whatHelped: { type: String, required: true },
    outcome: { type: String, required: true },
    freeText: { type: String, required: true },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TestimonialSchema.index({ mentorId: 1 });
TestimonialSchema.index({ authorId: 1 });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
