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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      let ipAddress = "";
      try {
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        ipAddress = ipResponse.data.ip;
      } catch (ipError) {
        console.error("Failed to get IP address:", ipError);
      }

      const response = await axios.post(
        "http://localhost:9090/login",
        {
          email: formData.email,
          password: formData.password,
          ipAddress: ipAddress,
        },
        {
          withCredentials: true, // Corrected from Credentials: true
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, message } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userContacts", user.contacts || "");
      localStorage.setItem("username", user.username);
      localStorage.setItem("userlocations", user.userlocation);

      setMessage(message || "Login successful");
      navigate("/user-profile");
      setErrors({});
      setFormData({ email: "", password: "", rememberMe: false });
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
        setMessage(
          error.response.status === 401
            ? "Invalid email or password."
            : "An error occurred during login."
        );
      } else if (error.request) {
        console.error(
          "No response received (CORS or network issue):",
          error.request
        );
        setMessage("Failed to connect to the server. Check CORS settings.");
      } else {
        console.error("Error setting up request:", error.message);
        setMessage("An unexpected error occurred.");
      }
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
                errors.email || errors.password ? "error" : "success"
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
                <label BULLET for="rememberMe">Remember me</label>
              </div>
              <Link to="/login/register/forgot-password" className="forgot-password">
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
                  href="http://localhost:8080/auth/google"
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