import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailFromUrl = decodeURIComponent(query.get('email') || '');
  const tokenFromUrl = query.get('token') || '';

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    otp: '',
    password: '',
    token: tokenFromUrl
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Apply fade-in effect
    const form = document.querySelector('.ts-reset-password-card');
    if (form) {
      form.classList.add('ts-fade-in');
    }

    // Check if token is present in URL
    if (!tokenFromUrl) {
      setApiError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [tokenFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'otp' ? value.trim() : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be a 6-digit number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one number';
    }

    if (!formData.token) {
      newErrors.token = 'Reset token is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      // Log request payload for debugging
      console.log('Request payload:', {
        email: formData.email,
        otp: formData.otp,
        token: formData.token,
        newPassword: formData.password
      });

      // Send reset password request to backend
      const response = await axios.post('https://authenticationagency.onrender.com/resetpassword', {
        email: formData.email,
        otp: formData.otp,
        token: formData.token,
        newPassword: formData.password
      }, {
        withCredentials: false
      });

      console.log('Password reset successful:', response.data);
      setSuccessMessage('Your password has been successfully reset!');
      setFormData({ email: '', otp: '', password: '', token: '' });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setApiError(errorMessage);
      
      if (errorMessage.includes('OTP')) {
        setErrors({ ...errors, otp: 'Invalid or expired OTP' });
      } else if (errorMessage.includes('token')) {
        setErrors({ ...errors, token: 'Invalid or expired reset token' });
      } else if (errorMessage.includes('User')) {
        setErrors({ ...errors, email: 'User not found' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ts-reset-password-page">
      <div className="ts-reset-password-container">
        <div className="ts-reset-password-card">
          <div className="ts-reset-password-header">
            <h1>Create New Password</h1>
            <p>Enter the OTP sent to your email and create a new password</p>
          </div>

          {successMessage && <div className="ts-success-message">{successMessage}</div>}
          {apiError && <div className="ts-api-error-message">{apiError}</div>}

          <form className="ts-reset-password-form" onSubmit={handleSubmit}>
            <div className="ts-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'ts-input-error' : ''}
                placeholder="Enter your registered email"
                autoFocus
              />
              {errors.email && <div className="ts-error-message">{errors.email}</div>}
            </div>

            <div className="ts-form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className={errors.otp ? 'ts-input-error' : ''}
                placeholder="Enter the OTP from your email"
                pattern="[0-9]*"
                maxLength="6"
              />
              {errors.otp && <div className="ts-error-message">{errors.otp}</div>}
            </div>

            <div className="ts-form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'ts-input-error' : ''}
                placeholder="Create a new password"
              />
              {errors.password && <div className="ts-error-message">{errors.password}</div>}
              <div className="ts-password-requirements">
                <p>Password must:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'ts-requirement-met' : ''}>
                    Be at least 8 characters long
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'ts-requirement-met' : ''}>
                    Include at least one uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'ts-requirement-met' : ''}>
                    Include at least one number
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              className="ts-btn-submit"
              disabled={isLoading || !tokenFromUrl}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="ts-login-options">
            <p>Remember your password? <Link to="/login">Sign In</Link></p>
            <p>Need a new OTP? <Link to="/forgot-password">Request New OTP</Link></p>
          </div>
        </div>

        <div className="ts-reset-password-image">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/88084f104235315.5f5ef1fe3cb58.jpg"
            alt="Travel destinations"
          />
          <div className="ts-image-overlay">
            <h2>Secure Your Account</h2>
            <p>Create a strong password to protect your Travel World experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};