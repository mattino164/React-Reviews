// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ------------------------------
// Initialize Express App
// ------------------------------
const app = express();

// ------------------------------
// Middleware
// ------------------------------

// Allow the deployed frontend and local development frontend to make
// credentialed requests (needed for the HTTP-only authentication cookie).
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header (such as health checks) are allowed.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------
// MongoDB Connection
// ------------------------------

// ------------------------------
// MongoDB Connection
// ------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    console.log("📁 Database:", mongoose.connection.name);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log(
      "📚 Collections:",
      collections.map((collection) => collection.name)
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
// ------------------------------
// API Routes
// ------------------------------
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/auth", require("./routes/auth"));

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
