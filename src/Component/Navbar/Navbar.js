import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo.png";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [profilePic, setProfilePic] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  );
  const [userEmail, setUserEmail] = useState("");
  const [activeLink, setActiveLink] = useState("Home");
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const location = useLocation();

  // Set active link based on current route
  useEffect(() => {
    const pathToName = {
      "/": "Home",
      "/destinations": "Destinations",
      "/tours": "Tours",
      "/Experiencepage": "Experiences",
      "/AboutUs-page": "About",
      "/contact-form": "Contact",
    };
    setActiveLink(pathToName[location.pathname] || "Home");
  }, [location]);

  // Function to check auth and update state
  const checkAuth = async () => {
    try {
      const response = await fetch(
        "https://authenticationagency.onrender.com/api/check-auth",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.isAuthenticated) {
        const storedUsername = localStorage.getItem("username") || "Guest";
        const storedProfilePic =
          localStorage.getItem("profilePic") ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
        const storedEmail = localStorage.getItem("userEmail") || "";
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setProfilePic(storedProfilePic);
        setUserEmail(storedEmail);
      } else {
        setIsLoggedIn(false);
        setUsername("Guest");
        setProfilePic(
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        );
        setUserEmail("");
      }
    } catch (error) {
      console.error("Error checking auth:", error.message);
      const storedUsername = localStorage.getItem("username");
      setIsLoggedIn(!!storedUsername);
      setUsername(storedUsername || "Guest");
      setProfilePic(
        localStorage.getItem("profilePic") ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      );
      setUserEmail(localStorage.getItem("userEmail") || "");
    }
  };

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for storage events to update user data
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem("username") || "Guest";
      const storedProfilePic =
        localStorage.getItem("profilePic") ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
      const storedEmail = localStorage.getItem("userEmail") || "";
      setIsLoggedIn(!!storedUsername && storedUsername !== "Guest");
      setUsername(storedUsername);
      setProfilePic(storedProfilePic);
      setUserEmail(storedEmail);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setNavbarActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for dropdown and mobile menu
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle resize for mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://authenticationagency.onrender.com/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
      // Clear localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userContacts");
      localStorage.removeItem("username");
      localStorage.removeItem("userlocations");
      localStorage.removeItem("profilePic");
      setIsLoggedIn(false);
      setUsername("Guest");
      setProfilePic(
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      );
      setUserEmail("");
      setDropdownOpen(false);
      window.dispatchEvent(new Event("storage")); // Notify other components
    } catch (err) {
      console.error("Error during logout:", err.message);
      alert("Failed to log out. Please try again.");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    closeMenu();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Tours", path: "/tours" },
    { name: "Experiences", path: "/Experiencepage" },
    // { name: "About", path: "/AboutUs-page" },
    { name: "Contact", path: "/contact-form" },
  ];

  return (
    <nav
      ref={navRef}
      className={`ts-modern-navbar ${
        navbarActive ? "ts-navbar-scrolled" : "ts-navbar-transparent"
      }`}
    >
      <div className="ts-navbar-container">
        <div className="ts-navbar-logo">
          <Link
            to="/"
            className="ts-logo-link"
            onClick={() => handleLinkClick("Home")}
          >
            <div className="ts-logo-wrapper">
              <img src={logo} alt="TravelSansar Logo" className="ts-logo-img" />
              <div className="ts-logo-glow"></div>
            </div>
            <span className="ts-logo-text">TravelSansar</span>
          </Link>
        </div>

        <button
          className={`ts-menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="ts-hamburger-line ts-line1"></span>
          <span className="ts-hamburger-line ts-line2"></span>
          <span className="ts-hamburger-line ts-line3"></span>
        </button>

        <div
          className={`ts-navigation-wrapper ${menuOpen ? "mobile-active" : ""}`}
        >
          <ul className="ts-nav-links">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                className="ts-nav-item"
                style={{ "--delay": `${index * 0.1}s` }}
              >
                <Link
                  to={item.path}
                  className={`ts-nav-link ${
                    activeLink === item.name ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick(item.name)}
                >
                  <span className="ts-link-text">{item.name}</span>
                  <div className="ts-link-underline"></div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="ts-navbar-actions">
            <Link
              to="/destinations"
              className="ts-cta-button"
              onClick={closeMenu}
            >
              <span className="ts-button-text">Book Now</span>
              <div className="ts-button-bg"></div>
              <div className="ts-button-shine"></div>
            </Link>

            {!isLoggedIn ? (
              <div className="ts-auth-links">
                <Link
                  to="/login"
                  className="ts-auth-button ts-login-btn"
                  onClick={closeMenu}
                >
                  <span>Login</span>
                  <div className="ts-auth-button-bg"></div>
                </Link>
                <Link
                  to="/login/register"
                  className="ts-auth-button ts-register-btn"
                  onClick={closeMenu}
                >
                  <span>Register</span>
                  <div className="ts-auth-button-bg"></div>
                </Link>
              </div>
            ) : (
              <div className="ts-user-profile" ref={dropdownRef}>
                <button
                  className={`ts-profile-button ${
                    dropdownOpen ? "active" : ""
                  }`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="ts-profile-avatar">
                    <img
                      src={profilePic}
                      alt="User Profile"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${username}&background=667eea&color=fff`;
                      }}
                    />
                    <div className="ts-avatar-ring"></div>
                    <div className="ts-status-indicator"></div>
                  </div>
                  <span className="ts-profile-name">{username}</span>
                  <svg
                    className={`ts-chevron-icon ${
                      dropdownOpen ? "rotated" : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className={`ts-dropdown-menu ${dropdownOpen ? "active" : ""}`}
                >
                  <div className="ts-dropdown-header">
                    <div className="ts-dropdown-avatar">
                      <img src={profilePic} alt="Profile" />
                    </div>
                    <div className="ts-dropdown-info">
                      <span className="ts-dropdown-name">{username}</span>
                      <span className="ts-dropdown-email">
                        {userEmail || "No email provided"}
                      </span>
                    </div>
                  </div>

                  <div className="ts-dropdown-divider"></div>

                  <Link
                    to="/user-profile"
                    className="ts-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="ts-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M19.4 15C19.1 15.3 19.1 15.7 19.4 16L20.4 17C20.7 17.3 20.7 17.7 20.4 18L18.6 19.8C18.3 20.1 17.9 20.1 17.6 19.8L16.6 18.8C16.3 18.5 15.9 18.5 15.6 18.8C15.3 19.1 15 19.4 14.6 19.6C14.2 19.8 14 20.2 14 20.6V22C14 22.6 13.6 23 13 23H11C10.4 23 10 22.6 10 22V20.6C10 20.2 9.8 19.8 9.4 19.6C9 19.4 8.7 19.1 8.4 18.8C8.1 18.5 7.7 18.5 7.4 18.8L6.4 19.8C6.1 20.1 5.7 20.1 5.4 19.8L3.6 18C3.3 17.7 3.3 17.3 3.6 17L4.6 16C4.9 15.7 4.9 15.3 4.6 15C4.4 14.6 4.1 14.3 3.9 13.9C3.7 13.5 3.3 13.3 2.9 13.3H1.5C0.9 13.3 0.5 12.9 0.5 12.3V11.7C0.5 11.1 0.9 10.7 1.5 10.7H2.9C3.3 10.7 3.7 10.5 3.9 10.1C4.1 9.7 4.4 9.4 4.6 9.1C4.9 8.8 4.9 8.4 4.6 8.1L3.6 7.1C3.3 6.8 3.3 6.4 3.6 6.1L5.4 4.3C5.7 4 6.1 4 6.4 4.3L7.4 5.3C7.7 5.6 8.1 5.6 8.4 5.3C8.7 5 9 4.7 9.4 4.5C9.8 4.3 10 3.9 10 3.5V2.1C10 1.5 10.4 1.1 11 1.1H13C13.6 1.1 14 1.5 14 2.1V3.5C14 3.9 14.2 4.3 14.6 4.5C15 4.7 15.3 5 15.6 5.3C15.9 5.6 16.3 5.6 16.6 5.3L17.6 4.3C17.9 4 18.3 4 18.6 4.3L20.4 6.1C20.7 6.4 20.7 6.8 20.4 7.1L19.4 8.1C19.1 8.4 19.1 8.8 19.4 9.1C19.6 9.5 19.9 9.8 20.1 10.2C20.3 10.6 20.7 10.8 21.1 10.8H22.5C23.1 10.8 23.5 11.2 23.5 11.8V12.4C23.5 13 23.1 13.4 22.5 13.4H21.1C20.7 13.4 20.3 13.6 20.1 14C19.9 14.4 19.6 14.7 19.4 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Settings</span>
                  </Link>

                  <div className="ts-dropdown-divider"></div>

                  <button
                    className="ts-dropdown-item ts-logout-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4 3 5 3H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 17L21 12L16 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className={`ts-mobile-overlay ${menuOpen ? "active" : ""}`}
            onClick={closeMenu}
          ></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;