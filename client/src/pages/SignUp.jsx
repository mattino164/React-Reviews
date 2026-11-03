// ------------------------------
// Import Dependencies
// ------------------------------
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import "../styles/SignUp.css";

// ------------------------------
// SignUp Component
// ------------------------------
// Props:
// - setUser: function to update the current logged-in user state
export default function SignUp({ setUser }) {
  // ------------------------------
  // State Variables
  // ------------------------------
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // ------------------------------
  // Handle Input Changes
  // ------------------------------
  // Updates state as user types in the form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // Handle Form Submission
  // ------------------------------
  // Sends signup request to backend and updates user state on success
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple password confirmation check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true } // Include cookies for authentication
      );

      setUser(res.data); // Update parent user state
      console.log("Signed up:", res.data);

      navigate("/"); // Redirect to home page after signup
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  // ------------------------------
  // Render Sign-Up Form
  // ------------------------------
  return (
    <div className="signup-page">
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-title">Sign Up</h2>

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button type="submit" className="auth-btn">
            Sign Up
          </button>

          {/* Footer with Login Link */}
          <p className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
