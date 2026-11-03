// ------------------------------
// Import Dependencies
// ------------------------------
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import "../styles/Login.css";

// ------------------------------
// Login Component
// ------------------------------
// Props:
// - setUser: function to update the current logged-in user state
export default function Login({ setUser }) {
  // ------------------------------
  // State Variables
  // ------------------------------
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ------------------------------
  // Handle Input Changes
  // ------------------------------
  // Updates state as user types in the email or password fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // Handle Form Submission
  // ------------------------------
  // Sends login request to backend and updates user state on success
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true } // Include cookies for authentication
      );

      setUser(res.data); // Update parent user state
      console.log("Logged in:", res.data);

      navigate("/"); // Redirect to home page after login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  // ------------------------------
  // Render Login Form
  // ------------------------------
  return (
    <div className="login-page">
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-title">Login</h2>

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

          {/* Submit Button */}
          <button type="submit" className="auth-btn">
            Login
          </button>

          {/* Footer with Sign-up Link */}
          <p className="auth-footer">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
