// ------------------------------
// Import Dependencies
// ------------------------------
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/ReviewCard.css"; // Styling for the review card

// ------------------------------
// ReviewCard Component
// ------------------------------
// Props:
// - review: individual review object
// - user: currently logged-in user object
// - setReviews: function to update the reviews state
// - reviews: array of all reviews
export default function ReviewCard({ review, user, setReviews, reviews }) {
  // ------------------------------
  // Delete Review Function
  // ------------------------------
  // Sends a DELETE request to the backend and removes the review from state
  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        withCredentials: true, // Send cookies for authentication
      });

      // Update frontend state after successful deletion
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // ------------------------------
  // Render Review Card
  // ------------------------------
  return (
    <div className="review-card-container">
      <div className="review-card">
        {/* Review Image (optional) */}
        {review.image && (
          <img
            src={`http://localhost:5000${review.image}`}
            alt={review.title}
            className="review-card-image"
          />
        )}

        {/* Review Title */}
        <h2 className="review-card-title">{review.title}</h2>

        {/* Review Categories */}
        <p className="review-card-category">
          {Array.isArray(review.category)
            ? review.category.join(", ") // Join array into a string
            : review.category}
        </p>

        {/* Review Rating */}
        <p className="review-card-rating">⭐ {review.rating}/5</p>

        {/* Link to full review */}
        <Link to={`/review/${review._id}`} className="review-card-link">
          Read More
        </Link>

        {/* Delete button (only visible to the review owner) */}
        {user && String(user._id) === String(review.authorId) && (
          <button
            className="delete-btn"
            onClick={() => deleteReview(review._id)}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
