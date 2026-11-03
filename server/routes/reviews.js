// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Review = require("../models/Review");

const router = express.Router();

// JWT_SECRET must match the secret used by the authentication routes.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}

// ------------------------------
// Authentication Middleware
// ------------------------------
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ------------------------------
// Configure Multer for Image Uploads
// ------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
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
    cb(new Error("Only .jpg and .png files are allowed!"));
  },
});

// ------------------------------
// Route: GET All Reviews
// ------------------------------
router.get("/", async (req, res) => {
  const { category, sort } = req.query;
  let filter = {};
  let sortOption = {};

  if (category) {
    filter.category = { $in: [category] };
  }

  if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "oldest") sortOption = { createdAt: 1 };
  else if (sort === "ratingHigh") sortOption = { rating: -1 };
  else if (sort === "ratingLow") sortOption = { rating: 1 };

  try {
    console.log("Review model collection:", Review.collection.name);
    console.log("Review model database:", Review.db.name);

    const count = await Review.countDocuments();
    console.log("Total reviews found:", count);

    const reviews = await Review.find(filter).sort(sortOption);
    console.log("Reviews returned:", reviews.length);
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
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const newReview = new Review({
      title: req.body.title,
      category: req.body.category,
      rating: req.body.rating,
      author: req.body.author,
      authorId: req.userId,
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
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Not found" });

    if (review.authorId.toString() !== String(req.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
