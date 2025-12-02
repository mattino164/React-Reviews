// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ------------------------------
// JWT Secret Key
// ------------------------------
// In production, move this to a .env file for security
const JWT_SECRET = "your_secret_key_here";

// ------------------------------
// Route: Sign Up
// ------------------------------
// Creates a new user, hashes the password automatically,
// and returns a JWT stored in an HTTP-only cookie.
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email taken" });

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT token valid for 7 days
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send token in HTTP-only cookie and return user email
    res
      .cookie("token", token, {
        httpOnly: true, // prevents JS access to the cookie
        secure: false, // set true in production (HTTPS)
        sameSite: "lax", // helps prevent CSRF
      })
      .json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Route: Login
// ------------------------------
// Verifies user credentials, and if valid, sends JWT in HTTP-only cookie.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password using User model method
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token valid for 7 days
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send token in HTTP-only cookie and return user email
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Route: Logout
// ------------------------------
// Clears the JWT cookie to log out the user.
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

// ------------------------------
// Route: Get Current User
// ------------------------------
// Reads JWT from cookies, verifies it, and returns the current user's info (excluding password).
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(null);

  try {
    // Decode JWT to get user ID
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB without password
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.json(null);
  }
});

// ------------------------------
// Export Router
// ------------------------------
module.exports = router;
