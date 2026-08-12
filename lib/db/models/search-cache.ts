import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { SEARCH_CHANNELS } from "@/lib/search/types";

const searchCacheSchema = new Schema(
  {
    queryHash: { type: String, required: true, unique: true, index: true },
    query: { type: String, required: true },
    channels: {
      type: [String],
      enum: SEARCH_CHANNELS,
      required: true,
    },
    results: { type: Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

searchCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SearchCacheDocument = InferSchemaType<typeof searchCacheSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SearchCache: Model<SearchCacheDocument> =
  mongoose.models.SearchCache ||
  mongoose.model<SearchCacheDocument>("SearchCache", searchCacheSchema);
