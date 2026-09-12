import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Academy Information */}
        <div className="footer-section">
          <h2>AIMS Academy</h2>

          <p>
            Providing quality education and helping students
            build a bright and successful future.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/news">News</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>📍 Garden Town, Multan</p>
          <p>📞 03366084596</p>
          <p>✉️ aimsacademy06@gamil.com</p>
        </div>

        {/* Admin */}
        <div className="footer-section">
          <h3>Administration</h3>

          <p>
            Authorized personnel only.
          </p>

          <Link to="/admin/login" className="footer-admin-link">
            Admin Login
          </Link>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AIMS Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
