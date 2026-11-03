import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./api";

// COMPONENT IMPORTS
import Header from "./components/Header";
import Footer from "./components/Footer";

// PAGE IMPORTS
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateReview from "./pages/CreateReview";
import ReviewPage from "./pages/ReviewPage";

function App() {
  // State to keep track of the currently logged-in user
  const [user, setUser] = useState(null);

  // Check if user is logged in when app mounts
  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data)) // store user info in state
      .catch(() => setUser(null)); // if not logged in, set user to null
  }, []);

  return (
    <Router>
      {/* Header receives user info and setUser to handle login/logout */}
      <Header user={user} setUser={setUser} />

      {/* Routes for different pages */}
      <Routes>
        {/* Home page showing list of reviews */}
        <Route path="/" element={<Home />} />

        {/* Review detail page */}
        <Route path="/review/:id" element={<ReviewPage />} />

        {/* Create a new review page */}
        <Route path="/create" element={<CreateReview />} />

        {/* Login page */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Signup page */}
        <Route path="/signup" element={<SignUp setUser={setUser} />} />
      </Routes>

      {/* Footer displayed on all pages */}
      <Footer />
    </Router>
  );
}

export default App;
