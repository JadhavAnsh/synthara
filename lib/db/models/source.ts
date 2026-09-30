import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const sourceTypes = ["web", "academic", "github", "manual"] as const;

const sourceSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    url: { type: String, default: "" },
    sourceType: { type: String, enum: sourceTypes, required: true },
    snippets: { type: [String], default: [] },
    credibilitySignals: { type: Schema.Types.Mixed, default: {} },
    externalId: { type: String, default: "" },
    selected: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

sourceSchema.index({ projectId: 1, externalId: 1 });

export type SourceDocument = InferSchemaType<typeof sourceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Source: Model<SourceDocument> =
  mongoose.models.Source || mongoose.model<SourceDocument>("Source", sourceSchema);
