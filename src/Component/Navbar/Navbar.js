import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo.png";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("username")
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Guest"
  );
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") ||
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg"
  ); // Initialize profilePic from localStorage
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setNavbarActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdown and menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Sync isLoggedIn, username, and profilePic with localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUsername = localStorage.getItem("username");
      const storedProfilePic = localStorage.getItem("profilePic");
      setIsLoggedIn(!!storedUsername);
      setUsername(storedUsername || "Guest");
      setProfilePic(
        storedProfilePic ||
          "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg"
      );
    };

    // Check initially
    checkLoginStatus();

    // Listen for storage changes (e.g., login/logout from another tab)
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("https://authenticationagency.onrender.com/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error during logout:", err.message);
    }

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userContacts");
    localStorage.removeItem("username");
    localStorage.removeItem("userlocations");
    localStorage.removeItem("profilePic");

    // Update state
    setIsLoggedIn(false);
    setUsername("Guest");
    setProfilePic(
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg"
    );
    setDropdownOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`navbar ${navbarActive ? "navbar-scrolled" : ""}`}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="TravelSansar Logo" />
            <span className="logo-text">TravelSansar</span>
          </Link>
        </div>

        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`navigation-wrapper ${menuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/destinations" className="nav-link" onClick={closeMenu}>
                Destinations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tours" className="nav-link" onClick={closeMenu}>
                Tours
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Experiencepage"
                className="nav-link"
                onClick={closeMenu}
              >
                Experiences
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/AboutUs-page" className="nav-link" onClick={closeMenu}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-form" className="nav-link" onClick={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="navbar-actions">
            <Link to="/destinations" className="btn-primary">
              Book Now
            </Link>

            {!isLoggedIn ? (
              <div className="auth-links">
                <Link to="/login" className="btn-secondary" onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  to="/login/register"
                  className="btn-secondary"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="user-profile" ref={dropdownRef}>
                <button
                  className={`profile-button ${dropdownOpen ? "active" : ""}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="profile-avatar">
                    <img
                      src={profilePic}
                      alt="User Profile"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
                      }}
                    />
                  </div>
                  <span className="profile-name">{username}</span>
                  <i className={`chevron ${dropdownOpen ? "up" : "down"}`}></i>
                </button>

                <div
                  className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}
                >
                  <Link
                    to="/user-profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="icon-profile"></i>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="icon-settings"></i>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/logout"
                    className="dropdown-item logout"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <i className="icon-logout"></i>
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
