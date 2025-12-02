// ------------------------------
// Import Dependencies
// ------------------------------
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Header.css"; // Header styling
import title from "../assets/Images/MRL-title-light.png"; // Logo image

// ------------------------------
// Header Component
// ------------------------------
// Displays site logo, navigation links, and user info (login/logout)
// Props:
// - user: current logged-in user object
// - setUser: function to update user state
export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  // ------------------------------
  // Fetch current user on mount
  // ------------------------------
  // Checks if user is logged in when the Header mounts
  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            withCredentials: true, // Send cookies for auth
          });
          setUser(res.data); // Set user state with response
        } catch {
          setUser(null); // No user logged in or session expired
        }
      };
      fetchUser();
    }
  }, [user, setUser]);

  // ------------------------------
  // Logout Function
  // ------------------------------
  // Logs out the user, clears state, and navigates to login page
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // ------------------------------
  // Render Header
  // ------------------------------
  return (
    <header>
      {/* Site Logo / Home Link */}
      <div className="header-name">
        <Link to="/">
          <img src={title} alt="MyReviewList" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav>
        {!user ? (
          // Show login/signup links if not logged in
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          // Show welcome text and logout button if logged in
          <>
            <span className="welcome-text">Hi, {user?.email || "User"}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
