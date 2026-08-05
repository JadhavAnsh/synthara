import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const citationSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    sourceId: { type: Schema.Types.ObjectId, ref: "Source", required: true, index: true },
    cslJson: { type: Schema.Types.Mixed, default: {} },
    range: {
      from: { type: Number, default: 0 },
      to: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

citationSchema.index({ documentId: 1, sourceId: 1 });

export type CitationDocument = InferSchemaType<typeof citationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Citation: Model<CitationDocument> =
  mongoose.models.Citation || mongoose.model<CitationDocument>("Citation", citationSchema);
