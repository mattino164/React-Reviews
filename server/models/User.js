// ------------------------------
// Import Dependencies
// ------------------------------
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ------------------------------
// Define User Schema
// ------------------------------
// This schema outlines the structure of a "user" document in MongoDB.
// Each user has an email, password, and a creation timestamp.
const UserSchema = new mongoose.Schema({
  // User's email (required and unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // User's password (required)
  password: {
    type: String,
    required: true,
  },

  // Timestamp of account creation (auto-filled)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ------------------------------
// Middleware: Hash password before saving
// ------------------------------
// This "pre-save" hook automatically hashes the password whenever
// a user is created or updates their password.
UserSchema.pre("save", async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified("password")) return next();

  // Hash password with bcrypt (salt rounds = 10)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ------------------------------
// Instance Method: Compare Passwords
// ------------------------------
// This method allows comparing a plain text password with the hashed password stored in DB.
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// ------------------------------
// Create User Model and Export
// ------------------------------
// The model allows interacting with the 'users' collection in MongoDB.
module.exports = mongoose.model("User", UserSchema);
