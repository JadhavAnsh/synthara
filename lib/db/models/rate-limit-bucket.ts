import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const rateLimitBucketSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: false },
);

rateLimitBucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RateLimitBucketDocument = InferSchemaType<typeof rateLimitBucketSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const RateLimitBucket: Model<RateLimitBucketDocument> =
  mongoose.models.RateLimitBucket ||
  mongoose.model<RateLimitBucketDocument>("RateLimitBucket", rateLimitBucketSchema);
