import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { ASSISTANT_ACTIONS } from "@/lib/validation/assistant";

const aiUsageSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    action: { type: String, enum: ASSISTANT_ACTIONS, required: true },
    model: { type: String, required: true },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
  },
  { timestamps: true },
);

aiUsageSchema.index({ userId: 1, projectId: 1, createdAt: -1 });

export type AiUsageDocument = InferSchemaType<typeof aiUsageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AiUsage: Model<AiUsageDocument> =
  mongoose.models.AiUsage || mongoose.model<AiUsageDocument>("AiUsage", aiUsageSchema);
