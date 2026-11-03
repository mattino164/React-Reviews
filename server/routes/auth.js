// ------------------------------
// Import Dependencies
// ------------------------------
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT_SECRET must be configured in the hosting provider's environment variables.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}

// Use secure cross-site cookies in production because the frontend and API
// are hosted on separate HTTPS domains. Local development keeps SameSite=Lax.
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// ------------------------------
// Route: Sign Up
// ------------------------------
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email taken" });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOptions).json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Route: Login
// ------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOptions).json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Route: Logout
// ------------------------------
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions).json({ message: "Logged out" });
});

// ------------------------------
// Route: Get Current User
// ------------------------------
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(null);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.json(null);
  }
});

module.exports = router;
