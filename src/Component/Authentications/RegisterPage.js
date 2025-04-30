import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../homePage/Footer';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contacts: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formProgress, setFormProgress] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset specific errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (name === 'email') setEmailError(false);
    if (name === 'username') setUsernameError(false);
    if (apiError) setApiError('');
  };

  // Validate step 1 (username and email)
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    return newErrors;
  };

  // Validate step 2 (contact and password)
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.contacts.trim()) {
      newErrors.contacts = 'Contact is required';
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

    return newErrors;
  };

  // Handle moving to next step
  const handleNextStep = (e) => {
    e.preventDefault();
    const step1Errors = validateStep1();

    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }

    setCurrentStep(2);
    setFormProgress(50);
    
    // Smooth scroll to top of form if needed
    const formElement = document.querySelector('.ts-register-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle going back to previous step
  const handlePrevStep = () => {
    setCurrentStep(1);
    setFormProgress(0);
  };

  // Handle form submission (step 2)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const step2Errors = validateStep2();

    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    setFormProgress(100);

    try {
      const response = await axios.post('http://localhost:9090/register', formData, {
        withCredentials: false
      });

      console.log('Registration successful:', response.data);
      setSuccessMessage('User registered successfully!');
      setFormData({ username: '', email: '', password: '', contacts: '' });
      setEmailError(false);
      setUsernameError(false);

      // Navigate to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data 
        ? typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Registration failed. Please try again.'
        : 'Registration failed. Please try again.';
      
      setApiError(errorMessage);
      setFormProgress(currentStep === 1 ? 0 : 50);

      if (errorMessage === 'Email already taken') {
        setEmailError(true);
        setCurrentStep(1); // Go back to step 1 if email is taken
        setFormProgress(0);
      }
      if (errorMessage === 'Username already taken') {
        setUsernameError(true);
        setCurrentStep(1); // Go back to step 1 if username is taken
        setFormProgress(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply fade-in effect on component load
    const form = document.querySelector('.ts-register-card');
    if (form) {
      form.classList.add('ts-fade-in');
    }
  }, []);

  return (
    <>
  
    <div className="ts-register-page">
      <div className="ts-register-container">
        <div className="ts-register-card">
          <div className="ts-register-header">
            <h1>Create Your Account</h1>
            <p>Join Travel World to discover amazing destinations</p>
            
            {/* Progress bar */}
            <div className="ts-progress-container">
              <div className="ts-progress-bar">
                <div 
                  className="ts-progress-fill" 
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <div className="ts-step-indicators">
                <div className={`ts-step-circle ${currentStep >= 1 ? 'ts-active' : ''}`}>1</div>
                <div className="ts-step-line"></div>
                <div className={`ts-step-circle ${currentStep >= 2 ? 'ts-active' : ''}`}>2</div>
              </div>
              <div className="ts-step-labels">
                <span className={currentStep === 1 ? 'ts-current-step' : ''}>Account Info</span>
                <span className={currentStep === 2 ? 'ts-current-step' : ''}>Contact & Security</span>
              </div>
            </div>
          </div>

          {successMessage && <div className="ts-success-message">{successMessage}</div>}
          {apiError && <div className="ts-api-error-message">{apiError}</div>}

          <form className="ts-register-form" onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}>
            {/* Step 1: Username and Email */}
            {currentStep === 1 && (
              <div className="ts-form-step ts-step-1">
                <div className="ts-form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`${errors.username || usernameError ? 'ts-input-error' : ''}`}
                    placeholder="Enter your username"
                    autoFocus
                  />
                  {(errors.username || usernameError) && (
                    <div className="ts-error-message">
                      {errors.username || 'Username already taken'}
                    </div>
                  )}
                </div>

                <div className="ts-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${errors.email || emailError ? 'ts-input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {(errors.email || emailError) && (
                    <div className="ts-error-message">
                      {errors.email || 'Email already taken'}
                    </div>
                  )}
                </div>

                <button type="submit" className="ts-btn-next">
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Contact and Password */}
            {currentStep === 2 && (
              <div className="ts-form-step ts-step-2">
                <div className="ts-form-group">
                  <label htmlFor="contacts">Contact</label>
                  <input
                    type="text"
                    id="contacts"
                    name="contacts"
                    value={formData.contacts}
                    onChange={handleChange}
                    className={errors.contacts ? 'ts-input-error' : ''}
                    placeholder="Enter your contact number"
                    autoFocus
                  />
                  {errors.contacts && <div className="ts-error-message">{errors.contacts}</div>}
                </div>

                <div className="ts-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'ts-input-error' : ''}
                    placeholder="Create a password"
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

                <div className="ts-step-buttons">
                  <button 
                    type="button" 
                    className="ts-btn-back"
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="ts-btn-register-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="ts-login-prompt">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
            <p>
              Forgot your password?{' '}
              <Link to="/login/register/forgot-password">Reset Password</Link>
            </p>
          </div>
        </div>

        <div className="ts-register-image">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/88084f104235315.5f5ef1fe3cb58.jpg"
            alt="Travel destinations"
          />
          <div className="ts-image-overlay">
            <h2>Join Our Travel Community</h2>
            <p>Create an account to unlock exclusive deals and personalized recommendations.</p>
          </div>
        </div>
      </div>

      
    </div>
    <Footer />
    </>
  );
};

export default RegisterPage;