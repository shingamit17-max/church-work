import mongoose, { Schema } from 'mongoose';
import { UserRole } from '@/types';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For credentials fallback
    role: { type: String, enum: Object.values(UserRole), default: UserRole.UNASSIGNED },
    onboardingComplete: { type: Boolean, default: false },
    linkedinId: { type: String },
    churchOrganization: { type: String },
    dob: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Text index for admin search (email already has a unique index from the schema)
UserSchema.index({ name: 'text', email: 'text' });
