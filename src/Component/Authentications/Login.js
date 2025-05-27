import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (message) setMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://authenticationagency.onrender.com/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Login successful");

      try {
        const authResponse = await axios.get(
          "https://authenticationagency.onrender.com/api/check-auth",
          {
            withCredentials: true,
          }
        );
        const { user } = authResponse.data;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userContacts", user.contacts || "");
          localStorage.setItem("username", user.username);
          localStorage.setItem("userlocations", user.userlocation || "");
          localStorage.setItem("profilePic", user.profilePic || "");
        }
      } catch (authError) {
        console.warn("Failed to fetch user data:", authError.message);
      }

      // Navigate and reload immediately
      navigate("/user-profile");
      // window.location.reload();

      setErrors({});
      setFormData({ email: "", password: "", rememberMe: false });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            error.response.data.message || "Invalid email or password.";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          "Unable to connect to the server. Please try again later.";
      }

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your Travel World account</p>
          </div>

          {message && (
            <div
              className={`message-box ${
                message.includes("successful") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="form-extras">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link
                to="/login/register/forgot-password"
                className="forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="social-login">
              <p>Or sign in with</p>
              <div className="social-buttons">
                <a
                  href="https://authenticationagency.onrender.com/auth/google"
                  className="btn-social google"
                >
                  <i className="icon-google"></i> Google
                </a>
              </div>
            </div>
          </form>

          <div className="register-prompt">
            <p>
              Don't have an account? <Link to="/login/register">Sign Up</Link>
            </p>
          </div>
        </div>

        <div className="login-image">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/88084f104235315.5f5ef1fe3cb58.jpg"
            alt="Travel adventure"
          />
          <div className="image-overlay">
            <h2>Adventure Awaits</h2>
            <p>Sign in to discover amazing destinations and exclusive deals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
