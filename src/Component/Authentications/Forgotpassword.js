import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPasswordPage.css';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Send request to API to generate OTP and reset token
      const response = await axios.post('http://localhost:9090/forgotpassword', { email }, {
        withCredentials: false
      });

      console.log('Reset email sent:', response.data);
      setSuccessMessage('An OTP and password reset link have been sent to your email.');
      setEmail('');
      
      // Navigate back to login after 3 seconds
      setTimeout(() => navigate('/login/register/forgot-password/Change-password'), 3000);
    } catch (error) {
      console.error('Error sending reset email:', error);
      const errorMessage = error.response?.data 
        ? typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Failed to send reset email. Please try again.'
        : 'Failed to send reset email. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply fade-in effect on component load
    const form = document.querySelector('.ts-forgot-password-card');
    if (form) {
      form.classList.add('ts-fade-in');
    }
  }, []);

  return (
    <div className="ts-forgot-password-page">
      <div className="ts-forgot-password-container">
        <div className="ts-forgot-password-card">
          <div className="ts-forgot-password-header">
            <h1>Forgot Password</h1>
            <p>Enter your email and we'll send you an OTP and link to reset your password</p>
          </div>

          {successMessage && <div className="ts-success-message">{successMessage}</div>}
          {error && <div className="ts-api-error-message">{error}</div>}

          <form className="ts-forgot-password-form" onSubmit={handleSubmit}>
            <div className="ts-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={error ? 'ts-input-error' : ''}
                placeholder="Enter your registered email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="ts-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Email...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="ts-login-options">
            <p>Remember your password? <Link to="/login">Sign In</Link></p>
            <p>Don't have an account? <Link to="/login/register/">Create Account</Link></p>
          </div>
        </div>

        <div className="ts-forgot-password-image">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/88084f104235315.5f5ef1fe3cb58.jpg"
            alt="Travel destinations"
          />
          <div className="ts-image-overlay">
            <h2>Recover Your Account</h2>
            <p>We'll help you get back to exploring amazing destinations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};