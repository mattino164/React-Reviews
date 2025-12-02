// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env

// ------------------------------
// Initialize Express App
// ------------------------------
const app = express();

// ------------------------------
// Middleware
// ------------------------------

// Enable CORS for frontend running on localhost:3000
// 'credentials: true' allows cookies to be sent with requests
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Parse incoming JSON requests
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Serve static files from the "uploads" folder for image access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------
// MongoDB Connection
// ------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ------------------------------
// API Routes
// ------------------------------
app.use("/api/reviews", require("./routes/reviews")); // Review CRUD routes
app.use("/api/auth", require("./routes/auth")); // Authentication routes

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
