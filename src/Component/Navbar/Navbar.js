import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "./logo.png";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const username = "UserName"; // Mock username, replace with auth context

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
      
      // Close mobile menu when clicking outside of nav
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
    <nav 
      ref={navRef}
      className={`navbar ${navbarActive ? "navbar-scrolled" : ""}`}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/" className="logo-link">
            <img src={logo} alt="TravelSansar Logo" />
            <span className="logo-text">TravelSansar</span>
          </a>
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
              <a href="/" className="nav-link" onClick={closeMenu}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/des" className="nav-link" onClick={closeMenu}>
                Destinations
              </a>
            </li>
            <li className="nav-item">
              <a href="/tours" className="nav-link" onClick={closeMenu}>
                Tours
              </a>
            </li>
            <li className="nav-item">
              <a href="/experiences" className="nav-link" onClick={closeMenu}>
                Experiences
              </a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link" onClick={closeMenu}>
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="/contact-form" className="nav-link" onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>

          <div className="navbar-actions">
            <a href="/booking" className="btn-primary">
              Book Now
            </a>

            {!isLoggedIn ? (
              <div className="auth-links">
                <a href="/login" className="btn-secondary">
                  Login
                </a>
                <a href="/register" className="btn-secondary">
                  Register
                </a>
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
                  <a href="/user-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="icon-profile"></i>
                    Profile
                  </a>
                  <a href="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="icon-settings"></i>
                    Settings
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="/logout" className="dropdown-item logout" onClick={() => setDropdownOpen(false)}>
                    <i className="icon-logout"></i>
                    Logout
                  </a>
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