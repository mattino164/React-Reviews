// ------------------------------
// Import Dependencies
// ------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import ReviewCard from "../components/ReviewCard";
import FilterSortBar from "../components/FilterSortBar";
import "../styles/Home.css";

// ------------------------------
// Home Component
// ------------------------------
// Displays latest reviews, allows filtering/sorting, and shows "Create Review" button if logged in
export default function Home() {
  // ------------------------------
  // State Variables
  // ------------------------------
  const [reviews, setReviews] = useState([]); // Array of all reviews
  const [loading, setLoading] = useState(true); // Loading state for fetching reviews
  const [filter, setFilter] = useState(""); // Selected category filter
  const [sort, setSort] = useState("newest"); // Selected sorting option
  const [user, setUser] = useState(null); // Currently logged-in user
  const navigate = useNavigate();

  // ------------------------------
  // Fetch Reviews
  // ------------------------------
  // Runs whenever filter or sort changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reviews`, {
          params: { category: filter, sort }, // Send filter and sort as query params
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [filter, sort]);

  // ------------------------------
  // Check Logged-in User
  // ------------------------------
  // Determines if "Create Review" button should be shown
  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // ------------------------------
  // Render Home Page
  // ------------------------------
  return (
    <main>
      {/* Top bar with title and optional Create Review button */}
      <div className="top-bar">
        <h1>Latest Reviews</h1>

        {/* Show Create Review button only if logged in */}
        {user && (
          <div
            className="create-review-btn"
            onClick={() => navigate("/create")}>
            <span className="plus-icon">+</span>
            <span className="btn-text">Create Review</span>
          </div>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <FilterSortBar onFilter={setFilter} onSort={setSort} />

      {/* Reviews Grid */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="review-grid">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                user={user} // Pass user for potential delete button logic
                setReviews={setReviews}
                reviews={reviews}
              />
            ))
          ) : (
            <p className="no-reviews">No reviews found.</p>
          )}
        </div>
      )}
    </main>
  );
}
