// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Review = require("../models/Review");

const router = express.Router();

// ------------------------------
// JWT Secret Key
// ------------------------------
// In production, move this to a .env file for security
const JWT_SECRET = "your_secret_key_here";

// ------------------------------
// Authentication Middleware
// ------------------------------
// Checks for a valid JWT token in cookies and sets req.userId
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Save user ID to request for later use
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ------------------------------
// Configure Multer for Image Uploads
// ------------------------------
// Files are stored in "uploads/" folder with unique timestamped names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    cb("Only .jpg and .png files are allowed!");
  },
});

// ------------------------------
// Route: GET All Reviews
// ------------------------------
// Supports optional filtering by category and sorting
router.get("/", async (req, res) => {
  const { category, sort } = req.query;
  let filter = {};
  let sortOption = {};

  // Filter by category if provided
  if (category) {
    filter.category = { $in: [category] };
  }

  // Sorting options
  if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "oldest") sortOption = { createdAt: 1 };
  else if (sort === "ratingHigh") sortOption = { rating: -1 };
  else if (sort === "ratingLow") sortOption = { rating: 1 };

  try {
    const reviews = await Review.find(filter).sort(sortOption);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ------------------------------
// Route: GET Single Review by ID
// ------------------------------
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(404).json({ error: "Review not found" });
  }
});

// ------------------------------
// Route: POST New Review
// ------------------------------
// Requires authentication and optional image upload
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const newReview = new Review({
      title: req.body.title,
      category: req.body.category,
      rating: req.body.rating,
      author: req.body.author,
      authorId: req.userId, // From authMiddleware
      body: req.body.body,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Route: DELETE Review by ID
// ------------------------------
// Only the review owner can delete their review
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Not found" });

    // Check ownership
    if (review.authorId.toString() !== String(req.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete review
    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Export Router
// ------------------------------
module.exports = router;
