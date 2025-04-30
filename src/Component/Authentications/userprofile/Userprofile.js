import React, { useState, useEffect } from "react";
import { User, MapPin, Briefcase, Globe, Edit2, Save, Upload } from "lucide-react";
import "./UserProfile.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    profilePic: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/35af6a41332353.57a1ce913e889.jpg",
    trips: 0,
    countries: 0,
  });

  // Load user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userEmail = localStorage.getItem("userEmail");
    const username = localStorage.getItem("username");
  
    const userlocations = localStorage.getItem("userlocations");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser((prevUser) => ({
          ...prevUser,
          name: username || parsedUser.username || "Unknown User",
          email: userEmail || parsedUser.email || "",
          bio: parsedUser.bio || "Passionate explorer of hidden gems and vibrant cultures.",
          location: userlocations || "Unknown Location",
          profilePic: parsedUser.profilePic || prevUser.profilePic,
          trips: parsedUser.trips || 0,
          countries: parsedUser.countries || 0,
        }));
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    } else {
      console.warn("No user data found in localStorage. User might not be logged in.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Optionally save the updated user data to localStorage or send to backend
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("username", user.name);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="tw-profile-page">
      {/* Header with wave effect */}
      <header className="tw-profile-header">
        <div className="tw-header-content">
          <h1>Your TravelWorld Profile</h1>
          <p>Manage your details and showcase your travel journey</p>
        </div>
        <div className="tw-wave-container">
          <svg className="tw-wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C150,20 350,80 720,40 C1080,0 1440,40 1440,80 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="tw-profile-main">
        <div className="tw-profile-card">
          <div className="tw-profile-layout">
            {/* Profile Picture and Stats Section */}
            <div className="tw-profile-sidebar">
              <div className="tw-profile-image-container">
                <div className="tw-profile-image-wrapper">
                  <img src={user.profilePic} alt="Profile" className="tw-profile-image" />
                  {isEditing && (
                    <div className="tw-profile-image-upload">
                      <label htmlFor="tw-profile-upload" className="tw-upload-btn">
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

            {/* Profile Details Section */}
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
          <p>Your data is secure with TravelWorld. We use advanced encryption to protect your information.</p>
        </div>
      </main>

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