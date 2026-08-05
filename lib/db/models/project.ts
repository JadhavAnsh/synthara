import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import type { CitationStyle } from "@/lib/validation/project";

const projectStatuses = ["draft", "active", "archived"] as const;

const projectSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    title: { type: String, required: true },
    citationStyle: {
      type: String,
      enum: ["ieee", "harvard"] satisfies CitationStyle[],
      required: true,
    },
    status: {
      type: String,
      enum: projectStatuses,
      default: "draft",
    },
  },
  { timestamps: true },
);

projectSchema.index({ userId: 1, createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project: Model<ProjectDocument> =
  mongoose.models.Project || mongoose.model<ProjectDocument>("Project", projectSchema);
