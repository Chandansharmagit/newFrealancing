import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Globe,
  Edit2,
  Save,
  Upload,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import "./UserProfile.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "Passionate explorer of hidden gems and vibrant cultures.",
    location: "Unknown Location",
    profilePic:
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg",
    trips: 0,
    countries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access URL query params

  // Fetch user data from the backend and sync with localStorage
  useEffect(() => {
    // Check if coming from login page via query param
    const queryParams = new URLSearchParams(location.search);
    const fromLogin = queryParams.get("fromLogin");

    // Refresh page only once if coming from login
    if (fromLogin === "true" && !localStorage.getItem("hasRefreshed")) {
      localStorage.setItem("hasRefreshed", "true"); // Prevent infinite refresh
      window.location.reload();
      return; // Exit useEffect to avoid running fetch logic before refresh
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://authenticationagency.onrender.com/api/check-auth",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          // Check localStorage for profilePic first
          const storedProfilePic = localStorage.getItem("profilePic");

          const userData = {
            name: data.user.username || "Unknown User",
            email: data.user.email || "",
            bio:
              data.user.bio ||
              "Passionate explorer of hidden gems and vibrant cultures.",
            location: data.user.location || "Unknown Location",
            trips: data.user.trips || 0,
            countries: data.user.countries || 0,
            profilePic:
              storedProfilePic ||
              data.user.profilePic ||
              "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg",
          };
          setUser(userData);

          // Sync localStorage with fetched user data
          localStorage.setItem("username", userData.name);
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("profilePic", userData.profilePic);
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: userData.name,
              email: userData.email,
              bio: userData.bio,
              location: userData.location,
              trips: userData.trips,
              countries: userData.countries,
              profilePic: userData.profilePic,
            })
          );
          // Trigger storage event to notify other components (e.g., Navbar)
          window.dispatchEvent(new Event("storage"));

          // Clear the hasRefreshed flag after successful fetch
          localStorage.removeItem("hasRefreshed");
        } else {
          // Clear localStorage if not authenticated
          localStorage.removeItem("user");
          localStorage.removeItem("username");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          localStorage.removeItem("userContacts");
          localStorage.removeItem("userlocations");
          localStorage.removeItem("profilePic");
          localStorage.removeItem("hasRefreshed"); // Clear flag
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load profile. Please try again.");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userContacts");
        localStorage.removeItem("userlocations");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("hasRefreshed"); // Clear flag
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profilePic: URL.createObjectURL(file) });
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("bio", user.bio);
        formData.append("location", user.location);
        if (document.getElementById("tw-profile-upload").files[0]) {
          formData.append(
            "profilePic",
            document.getElementById("tw-profile-upload").files[0]
          );
        }

        const response = await fetch(
          "https://authenticationagency.onrender.com/api/update-profile",
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const data = await response.json();
        console.log("Profile updated:", data);

        const updatedResponse = await fetch(
          "https://authenticationagency.onrender.com/api/check-auth",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const updatedData = await updatedResponse.json();
        if (updatedData.isAuthenticated && updatedData.user) {
          const updatedUser = {
            name: updatedData.user.username || "Unknown User",
            email: updatedData.user.email || "",
            bio:
              updatedData.user.bio ||
              "Passionate explorer of hidden gems and vibrant cultures.",
            location: updatedData.user.location || "Unknown Location",
            trips: updatedData.user.trips || 0,
            countries: updatedData.user.countries || 0,
            profilePic:
              updatedData.user.profilePic ||
              "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg",
          };
          setUser(updatedUser);

          localStorage.setItem("username", updatedUser.name);
          localStorage.setItem("userEmail", updatedUser.email);
          localStorage.setItem("profilePic", updatedUser.profilePic);
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: updatedUser.name,
              email: updatedUser.email,
              bio: updatedUser.bio,
              location: updatedUser.location,
              trips: updatedUser.trips,
              countries: updatedUser.countries,
              profilePic: updatedUser.profilePic,
            })
          );
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error("Error updating profile:", err.message);
        setError("Failed to save profile changes. Please try again.");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://authenticationagency.onrender.com/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userContacts");
        localStorage.removeItem("userlocations");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("hasRefreshed"); // Clear flag
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err.message);
      setError("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="tw-profile-page tw-loading">
        <div className="tw-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-profile-page tw-error">
        <div className="tw-error-message">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="tw-retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-profile-page">
      <header className="tw-profile-header">
        <div className="tw-header-content">
          <h1>Your TravelWorld Profile</h1>
          <p>Manage your details and showcase your travel journey</p>
        </div>
        <div className="tw-wave-container">
          <svg
            className="tw-wave"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,50 C150,20 350,80 720,40 C1080,0 1440,40 1440,80 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </header>

      <main className="tw-profile-main">
        <div className="tw-profile-card">
          <div className="tw-profile-layout">
            <div className="tw-profile-sidebar">
              <div className="tw-profile-image-container">
                <div className="tw-profile-image-wrapper">
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="tw-profile-image"
                  />
                  {isEditing && (
                    <div className="tw-profile-image-upload">
                      <label
                        htmlFor="tw-profile-upload"
                        className="tw-upload-btn"
                      >
                        <Upload size={20} />
                        <span>Upload</span>
                      </label>
                      <input
                        id="tw-profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="tw-file-input"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="tw-travel-stats">
                <div className="tw-stat-item">
                  <Briefcase color="#0095ff" size={24} />
                  <div className="tw-stat-content">
                    <span className="tw-stat-value">{user.trips}</span>
                    <span className="tw-stat-label">Trips Taken</span>
                  </div>
                </div>
                <div className="tw-stat-item">
                  <Globe color="#0095ff" size={24} />
                  <div className="tw-stat-content">
                    <span className="tw-stat-value">{user.countries}</span>
                    <span className="tw-stat-label">Countries Visited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-profile-details">
              <div className="tw-form-group">
                <label className="tw-form-label">
                  <User size={18} />
                  <span>Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="tw-form-input"
                  />
                ) : (
                  <p className="tw-form-value">{user.name}</p>
                )}
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="tw-form-input"
                  />
                ) : (
                  <p className="tw-form-value">{user.email}</p>
                )}
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="tw-form-textarea"
                    rows="4"
                  />
                ) : (
                  <p className="tw-form-value">{user.bio}</p>
                )}
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">
                  <MapPin size={18} />
                  <span>Location</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={user.location}
                    onChange={handleInputChange}
                    className="tw-form-input"
                  />
                ) : (
                  <p className="tw-form-value">{user.location}</p>
                )}
              </div>

              <div className="tw-button-group">
                <button onClick={toggleEdit} className="tw-edit-button">
                  {isEditing ? (
                    <>
                      <Save size={18} />
                      <span>Save Profile</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-trust-section">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <p>
            Your data is secure with TravelWorld. We use advanced encryption to
            protect your information.
          </p>
        </div>
      </main>
      <nav className="tw-profile-nav">
        <div className="tw-nav-container">
          <div className="tw-logo">
            <span>TravelWorld</span>
          </div>
          <div className="tw-nav-actions">
            <button
              onClick={handleLogout}
              className="tw-logout-button"
              aria-label="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <footer className="tw-profile-footer">
        <div className="tw-footer-content">
          <p>© {new Date().getFullYear()} TravelWorld. All rights reserved.</p>
          <div className="tw-footer-links">
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Service</a>
            <a href="/">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;