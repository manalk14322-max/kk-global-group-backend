const mongoose = require("mongoose");

const globalCache = globalThis.__kkGlobalMongoCache || {
  conn: null,
  promise: null,
};

globalThis.__kkGlobalMongoCache = globalCache;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (globalCache.promise) {
    globalCache.conn = await globalCache.promise;
    return globalCache.conn;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  globalCache.promise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
      connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 5000),
      maxPoolSize: 10,
    })
    .then((connection) => {
      globalCache.conn = connection;
      return connection;
    })
    .catch((error) => {
      globalCache.promise = null;
      throw error;
    });

  globalCache.conn = await globalCache.promise;
  console.log("MongoDB connected successfully");
  return globalCache.conn;
};

module.exports = connectDB;
