// ------------------------------
// Import Dependencies
// ------------------------------

// Import the CSS file for footer styling
import "../styles/Footer.css";

// Import social media icons from React Icons
import { FaGithub, FaLinkedin } from "react-icons/fa";

// ------------------------------
// Footer Component
// ------------------------------
// Displays copyright information and social media links
export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* ------------------------------
            Copyright Text
            Shows the copyright year and project name
        ------------------------------ */}
        <p className="footer-text">© 2025 Re:write. All rights reserved.</p>

        {/* ------------------------------
            Social Media Icons
            External links open in a new tab
        ------------------------------ */}
        <div className="social-icons">
          <a
            href="https://github.com/mattino164"
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/valentino-soto-97720a212"
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
