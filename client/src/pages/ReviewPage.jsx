// ------------------------------
// Import Dependencies
// ------------------------------
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/ReviewPage.css";

// ------------------------------
// ReviewPage Component
// ------------------------------
// Displays a single review with image, title, categories, rating, date, body, and author
export default function ReviewPage() {
  const { id } = useParams(); // Get review ID from URL params
  const [review, setReview] = useState(null); // Store review data

  // ------------------------------
  // Fetch Review Data
  // ------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReview(data))
      .catch((err) => console.error("Error loading review:", err));
  }, [id]);

  // ------------------------------
  // Show Loading State
  // ------------------------------
  if (!review) return <p>Loading...</p>;

  // ------------------------------
  // Render Review
  // ------------------------------
  return (
    <div className="review-container">
      {/* Review Image */}
      {review.image && (
        <img
          src={`${API_URL}${review.image}`} // prepend server URL
          alt={`${review.title} cover`}
          className="review-image"
        />
      )}

      {/* Review Title */}
      <h1 className="review-title">{review.title}</h1>

      {/* Review Categories */}
      <div className="review-categories">
        {Array.isArray(review.category) ? (
          review.category.map((cat, i) => (
            <span key={i} className="review-category-tag">
              {cat}
            </span>
          ))
        ) : (
          <span className="review-category-tag">{review.category}</span>
        )}
      </div>

      {/* Review Metadata: Rating & Date */}
      <div className="review-meta">
        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= review.rating ? "star filled" : "star"}>
              ★
            </span>
          ))}
        </div>
        <p className="review-date">
          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Review Body */}
      <p className="review-body">{review.body}</p>

      {/* Review Author */}
      <p className="review-author">By {review.author || "Anonymous"}</p>
    </div>
  );
}
