// ------------------------------
// Import Dependencies
// ------------------------------
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import "../styles/CreateReview.css";

// ------------------------------
// CreateReview Component
// ------------------------------
// Provides a form to create a new review with title, categories, rating, author, body, and optional image
export default function CreateReview() {
  const [form, setForm] = useState({
    title: "",
    categories: [],
    rating: 1,
    author: "",
    body: "",
    image: null,
  });
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // ------------------------------
  // Add Category
  // ------------------------------
  // Adds a category if it is not already selected
  const addCategory = (cat) => {
    if (cat && !form.categories.includes(cat)) {
      setForm({ ...form, categories: [...form.categories, cat] });
    }
  };

  // ------------------------------
  // Remove Category
  // ------------------------------
  // Removes a selected category from the form
  const removeCategory = (cat) => {
    setForm({
      ...form,
      categories: form.categories.filter((c) => c !== cat),
    });
  };

  // ------------------------------
  // Handle Textarea Auto-Resize
  // ------------------------------
  // Automatically adjusts textarea height based on content
  const handleTextareaChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setForm({ ...form, body: e.target.value });
  };

  // ------------------------------
  // Submit Form
  // ------------------------------
  // Sends the review data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("rating", form.rating);
      data.append("author", form.author);
      data.append("body", form.body);
      form.categories.forEach((c) => data.append("category", c));
      if (form.image) data.append("image", form.image);

      await axios.post(`${API_URL}/api/reviews`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Send cookies for auth
      });

      // Redirect to home page after successful creation
      navigate("/");
    } catch (err) {
      console.error(
        "Error creating review:",
        err.response ? err.response.data : err.message
      );
      alert("Error creating review. Make sure all fields are correct.");
    }
  };

  // ------------------------------
  // Render Form
  // ------------------------------
  return (
    <div className="create-review-page">
      <div className="create-review-card">
        <h1 className="create-review-title">Create Review</h1>
        <form onSubmit={handleSubmit} className="create-review-form">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* Categories Selector */}
          <div className="category-selector">
            <select
              onChange={(e) => {
                addCategory(e.target.value);
                e.target.value = "";
              }}>
              <option value="">Select Category</option>
              {[
                "Anime",
                "Movie",
                "Game",
                "Sports",
                "Shooter",
                "Fighting",
                "Strategy",
                "Drama",
                "Shonen",
                "Horror",
                "Action",
                "Comedy",
                "Family",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Display selected categories as tags */}
            <div className="category-tags">
              {form.categories.map((cat) => (
                <span key={cat} className="category-tag">
                  {cat}{" "}
                  <button type="button" onClick={() => removeCategory(cat)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Rating Input */}
          <div className="rating-container">
            <span className="rating-label">Rate:</span>
            <input
              type="number"
              placeholder="1-5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              min="1"
              max="5"
              required
            />
          </div>

          {/* Author Input */}
          <input
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />

          {/* Body Textarea */}
          <textarea
            placeholder="Write your review here..."
            value={form.body}
            onChange={handleTextareaChange}
            required
          />

          {/* Image Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          {/* Submit Button */}
          <button type="submit" className="create-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
