import mongoose, { Schema } from 'mongoose';

const SystemConfigSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "onboarding_mentee_steps"
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
