// Set REACT_APP_API_URL in the hosting provider to your deployed API URL.
// The localhost fallback keeps local development working.
export const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
