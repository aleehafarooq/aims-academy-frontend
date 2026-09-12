import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import logo from "../assets/aims-logo.jpg.jpeg";

function Navbar() {
  /* =================================
     THEME STATE
  ================================= */

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("aims-theme");

    return savedTheme === "dark";
  });

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =================================
     APPLY SAVED THEME
  ================================= */

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "aims-theme",
      theme
    );
  }, [darkMode]);

  /* =================================
     THEME TOGGLE
  ================================= */

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  /* =================================
     CLOSE MOBILE MENU
  ================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <a
          href="/"
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            alt="AIMS Academy Logo"
          />
        </a>

        {/* Desktop Navigation */}

        <nav
          className={`navbar-links ${
            mobileMenuOpen
              ? "mobile-open"
              : ""
          }`}
        >

          <a
            href="/"
            onClick={closeMobileMenu}
          >
            Home
          </a>

          <a
            href="/about"
            onClick={closeMobileMenu}
          >
            About Us
          </a>

          <a
            href="/courses"
            onClick={closeMobileMenu}
          >
            Courses
          </a>

          <a
            href="/news"
            onClick={closeMobileMenu}
          >
            News
          </a>

          <a
            href="/contact"
            onClick={closeMobileMenu}
          >
            Contact Us
          </a>

        </nav>

        {/* Right Side Controls */}

        <div className="navbar-actions">

          {/* Theme Toggle */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            type="button"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Mobile Menu Button */}

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous
              )
            }
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
