import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { SEARCH_CHANNELS } from "@/lib/search/types";

const searchJobStatuses = ["pending", "processing", "failed", "done"] as const;

const searchJobSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    query: { type: String, required: true },
    channels: {
      type: [String],
      enum: SEARCH_CHANNELS,
      required: true,
      default: SEARCH_CHANNELS,
    },
    channel: { type: String, enum: SEARCH_CHANNELS, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    status: { type: String, enum: searchJobStatuses, default: "pending", index: true },
    lastError: { type: String, default: "" },
    runAfter: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

searchJobSchema.index({ projectId: 1, status: 1, runAfter: 1 });
searchJobSchema.index(
  { projectId: 1, query: 1, channel: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "processing"] } },
  },
);

export type SearchJobDocument = InferSchemaType<typeof searchJobSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SearchJob: Model<SearchJobDocument> =
  mongoose.models.SearchJob || mongoose.model<SearchJobDocument>("SearchJob", searchJobSchema);
