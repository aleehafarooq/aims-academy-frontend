import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import logo from "../assets/aims-logo.jpg.jpeg";

/* =================================
   SHARED THEME KEY
================================= */

const THEME_STORAGE_KEY = "aims_theme";

/* =================================
   APPLY THEME
================================= */

const applyTheme = (theme) => {
  const selectedTheme =
    theme === "dark" ? "dark" : "light";

  /* Apply global HTML theme */

  document.documentElement.setAttribute(
    "data-theme",
    selectedTheme
  );

  /* Keep existing admin dark-mode
     CSS compatibility */

  document.body.classList.toggle(
    "dark-mode",
    selectedTheme === "dark"
  );

  /* Save shared theme */

  localStorage.setItem(
    THEME_STORAGE_KEY,
    selectedTheme
  );
};


/* =================================
   GET SAVED THEME
================================= */

const getSavedTheme = () => {
  const savedTheme =
    localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === "dark"
    ? "dark"
    : "light";
};


/* =================================
   NAVBAR
================================= */

function Navbar() {

  /* =================================
     THEME STATE
  ================================= */

  const [darkMode, setDarkMode] = useState(
    () => getSavedTheme() === "dark"
  );


  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  /* =================================
     APPLY INITIAL THEME
  ================================= */

  useEffect(() => {

    const savedTheme = getSavedTheme();

    applyTheme(savedTheme);

    setDarkMode(
      savedTheme === "dark"
    );

  }, []);


  /* =================================
     LISTEN FOR THEME CHANGES
     FROM ADMIN SETTINGS
  ================================= */

  useEffect(() => {

    const handleThemeChange = (event) => {

      const newTheme =
        event?.detail?.theme ||
        getSavedTheme();

      const selectedTheme =
        newTheme === "dark"
          ? "dark"
          : "light";

      /*
        IMPORTANT:
        Do NOT call applyTheme() here.

        The component that changed the theme
        has already applied it.

        Calling applyTheme() here and dispatching
        another event can cause components to
        repeatedly overwrite each other.
      */

      setDarkMode(
        selectedTheme === "dark"
      );

      document.documentElement.setAttribute(
        "data-theme",
        selectedTheme
      );

      document.body.classList.toggle(
        "dark-mode",
        selectedTheme === "dark"
      );

    };


    window.addEventListener(
      "aims-theme-change",
      handleThemeChange
    );


    return () => {

      window.removeEventListener(
        "aims-theme-change",
        handleThemeChange
      );

    };

  }, []);


  /* =================================
     THEME TOGGLE
  ================================= */

  const toggleTheme = () => {

    const newTheme =
      darkMode
        ? "light"
        : "dark";


    /* Update Navbar state */

    setDarkMode(
      newTheme === "dark"
    );


    /* Apply and save theme */

    applyTheme(newTheme);


    /* Notify Admin Settings and
       other components */

    window.dispatchEvent(
      new CustomEvent(
        "aims-theme-change",
        {
          detail: {
            theme: newTheme,
          },
        }
      )
    );

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