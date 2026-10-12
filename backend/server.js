if (!globalThis.crypto) {
  globalThis.crypto = require("crypto");
}

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env
dotenv.config();

const connectDB = require("./src/config/db");
const apiRoutes = require("./src/routes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, local dev, custom CLIENT_URL, and vercel.app previews
    if (
      !origin ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.endsWith(".vercel.app") ||
      origin === process.env.CLIENT_URL
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive fallback
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "Nivaran Backend API",
    status: "Active",
    docs: "/api/v1/health",
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    errors: ["Route does not exist"],
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server locally (on Vercel serverless, app is exported)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Nivaran Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;