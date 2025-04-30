import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      let ipAddress = '';
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        ipAddress = ipResponse.data.ip;
      } catch (ipError) {
        console.error('Failed to get IP address:', ipError);
      }

      const response = await axios.post(
        'http://localhost:9090/login',
        {
          email: formData.email,
          password: formData.password,
          ipAddress: ipAddress,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { user, message } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userContacts', user.contacts || '');
      localStorage.setItem('username', user.username);
      localStorage.setItem('userlocations', user.userlocation);

      setMessage(message || 'Login successful');
      navigate('/user-profile');
      setErrors({});
      setFormData({ email: '', password: '', rememberMe: false });
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setMessage(
          error.response.status === 401
            ? 'Invalid email or password.'
            : 'An error occurred during login.'
        );
      } else if (error.request) {
        setMessage('Failed to connect to the server. Check CORS settings.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/google';
  };

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: { duration: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="login-popup-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="login-popup-container"
        variants={containerVariants}
      >
        <div className="login-popup-sidebar">
          <motion.img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Login background"
            className="login-popup-sidebar-image"
            variants={childVariants}
          />
        </div>
        <motion.div className="login-popup-content" variants={childVariants}>
          <motion.div className="login-popup-header" variants={childVariants}>
            <h2>Welcome Back</h2>
            <button className="login-popup-close-button" onClick={onClose}>×</button>
          </motion.div>

          {message && (
            <motion.div
              className={`login-popup-message-box ${
                errors.email || errors.password ? 'error' : 'success'
              }`}
              variants={childVariants}
            >
              {message}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="login-popup-form"
            variants={childVariants}
          >
            <motion.div className="login-popup-form-group" variants={childVariants}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && (
                <div className="login-popup-error-message">{errors.email}</div>
              )}
            </motion.div>

            <motion.div className="login-popup-form-group" variants={childVariants}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                required
              />
              {errors.password && (
                <div className="login-popup-error-message">{errors.password}</div>
              )}
            </motion.div>

            <motion.div className="login-popup-form-options" variants={childVariants}>
              <label className="login-popup-remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />{' '}
                Remember me
              </label>
              <a href="/login/register/forgot-password" className="login-popup-forgot-password">
                Forgot Password?
              </a>
            </motion.div>

            <motion.button
              type="submit"
              className="login-popup-login-button"
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </motion.button>

            <motion.div className="login-popup-or-divider" variants={childVariants}>
              OR
            </motion.div>

            <motion.button
              type="button"
              className="login-popup-google-login-button"
              onClick={handleGoogleLogin}
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="login-popup-google-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.62 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.62 1 4.01 3.48 2.18 7.07L5.84 9.9c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </motion.button>

            <motion.div className="login-popup-signup-option" variants={childVariants}>
              Don't have an account?{' '}
              <a href="/login/register">Sign up</a>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPopup;