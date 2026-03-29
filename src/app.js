const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const investorRoutes = require("./routes/investorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalized = origin.trim().toLowerCase();
  const exactMatches = allowedOrigins.map((value) => value.toLowerCase());

  if (exactMatches.includes(normalized)) {
    return true;
  }

  if (
    normalized.startsWith("http://localhost:") ||
    normalized.startsWith("https://localhost:") ||
    normalized.startsWith("http://127.0.0.1:") ||
    normalized.startsWith("https://127.0.0.1:")
  ) {
    return true;
  }

  if (normalized.endsWith(".vercel.app") || normalized.endsWith(".github.io")) {
    return true;
  }

  return allowedOrigins.length === 0;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: origin not allowed (${origin})`));
  },
  credentials: true,
};

app.use(
  cors(corsOptions)
);
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KK Global Group Backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

const requireDatabaseConnection = async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    return next(error);
  }
};

app.use("/api/auth", requireDatabaseConnection, authRoutes);
app.use("/api/contact", requireDatabaseConnection, contactRoutes);
app.use("/api/investor", requireDatabaseConnection, investorRoutes);
app.use("/api/admin", requireDatabaseConnection, adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
