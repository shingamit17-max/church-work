import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'resource'], default: 'text' },
    attachments: [{ type: String }], // Array of URLs
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

MessageSchema.index({ matchId: 1, createdAt: 1 });

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
