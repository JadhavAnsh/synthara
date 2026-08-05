import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import type { CitationStyle } from "@/lib/validation/project";

const exportStatuses = ["none", "pending", "ready"] as const;

const documentSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },
    citationStyle: {
      type: String,
      enum: ["ieee", "harvard"] satisfies CitationStyle[],
      required: true,
    },
    editorState: { type: Schema.Types.Mixed, default: null },
    exportStatus: { type: String, enum: exportStatuses, default: "none" },
  },
  { timestamps: true },
);

export type DocumentRecord = InferSchemaType<typeof documentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const DocumentModel: Model<DocumentRecord> =
  mongoose.models.Document ||
  mongoose.model<DocumentRecord>("Document", documentSchema);
