// Import Mongoose to define MongoDB schemas
const mongoose = require("mongoose");

// ------------------------------
// Define the Review schema
// ------------------------------
// This schema outlines the structure of a "review" document in MongoDB.
// Each review contains information like title, category, rating, author, and more.
const ReviewSchema = new mongoose.Schema({
  // Title of the review (required)
  title: {
    type: String,
    required: true,
  },

  // Categories/tags for the review (required, array of strings)
  category: [
    {
      type: String,
      required: true,
    },
  ],

  // Rating of the review from 1 to 5 (required)
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  // Author name of the review (required)
  author: {
    type: String,
    required: true,
  },

  // Reference to the user who created the review (required)
  authorId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB unique ID
    ref: "User", // Reference to the User model
    required: true,
  },

  // Main content/body of the review (optional)
  body: String,

  // Optional image associated with the review
  image: {
    type: String,
  },

  // Timestamp when the review is created (auto-filled)
  createdAt: {
    type: Date,
    default: Date.now, // Automatically adds the current date and time
  },
});

// ------------------------------
// Create the Review model
// ------------------------------
// The model allows interacting with the 'reviews' collection in MongoDB.
const Review = mongoose.model("Review", ReviewSchema);

// Export the model to use in other parts of the application
module.exports = Review;
