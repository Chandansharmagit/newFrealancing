import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Navbar.css";
import logo from "./logo.png";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const username = "UserName"; // Mock username

  useEffect(() => {
    const handleScroll = () => {
      setNavbarActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav ref={navRef} className={`navbar ${navbarActive ? "navbar-scrolled" : ""}`}>
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
              <Link to="/experiences" className="nav-link" onClick={closeMenu}>
                Experiences
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={closeMenu}>
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
            <Link to="/booking" className="btn-primary">
              Book Now
            </Link>

            {!isLoggedIn ? (
              <div className="auth-links">
                <Link
                  to="/login"
                  className="btn-secondary"
                  onClick={() => setIsLoggedIn(true)} // Simulate login
                >
                  Login
                </Link>
                <Link to="/register" className="btn-secondary">
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
                      src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg"
                      alt="User Profile"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
                      }}
                    />
                  </div>
                  <span className="profile-name">{username}</span>
                  <i className={`chevron ${dropdownOpen ? "up" : "down"}`}></i>
                </button>

                <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
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
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsLoggedIn(false); // Simulate logout
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