import mongoose, { Schema } from 'mongoose';
import { UserRole } from '@/types';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For credentials fallback
    role: { type: String, enum: Object.values(UserRole), required: true },
    onboardingComplete: { type: Boolean, default: false },
    linkedinId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
