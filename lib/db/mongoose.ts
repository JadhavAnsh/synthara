import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/synthara";

const MONGOOSE_OPTIONS = {
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
  socketTimeoutMS: 10_000,
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseConn || { conn: null, promise: null };

if (!global.mongooseConn) {
  global.mongooseConn = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, MONGOOSE_OPTIONS);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
