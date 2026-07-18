import mongoose, { Schema } from 'mongoose';

const CustomQuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'mcq', 'checkbox'], required: true },
    options: [{ type: String }], // For mcq or checkbox types
    targetRole: { type: String, enum: ['MENTEE', 'MENTOR', 'BOTH'], required: true },
    isRequired: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CustomQuestion = mongoose.models.CustomQuestion || mongoose.model('CustomQuestion', CustomQuestionSchema);
