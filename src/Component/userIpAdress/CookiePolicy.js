import React, { useState, useEffect } from 'react';
import './CookiePolicy.css';

const CookiePolicy = () => {
  // State for cookie preferences
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
    personalization: false
  });

  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Handle toggling individual cookie types
  const handleCookieToggle = (cookieType) => {
    if (cookieType === 'necessary') return; // Can't toggle necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  // Handle saving all preferences
  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentChoice', 'custom');
    
    // Show the confirmation message
    setShowSaveConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  // Handle accepting all cookies
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentChoice', 'accepted');
    
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  // Handle declining all optional cookies
  const handleDeclineAll = () => {
    const minimalConsent = {
      necessary: true, // Keep necessary
      functional: false,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    setCookiePreferences(minimalConsent);
    localStorage.setItem('cookiePreferences', JSON.stringify(minimalConsent));
    localStorage.setItem('cookieConsentChoice', 'declined');
    
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  return (
    <div className="cookie-policy-page">
      <div className="cookie-policy-container">
        <div className="cookie-header">
          <h1>Cookie Settings</h1>
          <p className="cookie-intro">
            We use cookies to improve your experience on our website, analyze site traffic, and personalize content. 
            You can choose which cookies you want to allow. Learn more about cookies in our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>

        <div className="cookie-settings-actions">
          <button 
            className="cookie-btn secondary"
            onClick={handleDeclineAll}
          >
            Decline All
          </button>
          <button 
            className="cookie-btn primary"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>
        </div>

        <div className="cookie-types-container">
          {/* Necessary cookies */}
          <div className="cookie-type-card">
            <div className="cookie-type-header">
              <div>
                <h3>Strictly Necessary</h3>
                <p className="badge required">Required</p>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch disabled">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.necessary} 
                    readOnly
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="cookie-description">
              These cookies are essential for the website to function properly. They enable basic 
              functions like page navigation, access to secure areas, and maintaining your session. 
              The website cannot function properly without these cookies, and they can only be disabled 
              by changing your browser preferences.
            </p>
            <div className="cookie-examples">
              <h4>Examples:</h4>
              <ul>
                <li>Session cookies</li>
                <li>Authentication cookies</li>
                <li>Security cookies</li>
              </ul>
            </div>
          </div>

          {/* Functional cookies */}
          <div className="cookie-type-card">
            <div className="cookie-type-header">
              <div>
                <h3>Functional</h3>
                <p className="badge optional">Optional</p>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.functional} 
                    onChange={() => handleCookieToggle('functional')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="cookie-description">
              These cookies enable enhanced functionality and personalization, such as remembering your 
              preferences, login information, and selected options. They may be set by us or by third-party 
              providers whose services we use on our pages.
            </p>
            <div className="cookie-examples">
              <h4>Examples:</h4>
              <ul>
                <li>Language preference cookies</li>
                <li>Region/country preference cookies</li>
                <li>User interface customization cookies</li>
              </ul>
            </div>
          </div>

          {/* Analytics cookies */}
          <div className="cookie-type-card">
            <div className="cookie-type-header">
              <div>
                <h3>Analytics & Performance</h3>
                <p className="badge optional">Optional</p>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.analytics} 
                    onChange={() => handleCookieToggle('analytics')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="cookie-description">
              These cookies help us understand how visitors interact with our website by collecting and 
              reporting information anonymously. They help us improve the way our website works and 
              optimize user experience.
            </p>
            <div className="cookie-examples">
              <h4>Examples:</h4>
              <ul>
                <li>Google Analytics</li>
                <li>Page load time tracking</li>
                <li>Error monitoring</li>
                <li>User behavior analysis</li>
              </ul>
            </div>
          </div>

          {/* Marketing cookies */}
          <div className="cookie-type-card">
            <div className="cookie-type-header">
              <div>
                <h3>Marketing & Advertising</h3>
                <p className="badge optional">Optional</p>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.marketing} 
                    onChange={() => handleCookieToggle('marketing')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="cookie-description">
              These cookies are used to track visitors across websites to display relevant advertisements. 
              They help make advertising more engaging to users and more valuable to publishers and advertisers.
            </p>
            <div className="cookie-examples">
              <h4>Examples:</h4>
              <ul>
                <li>Retargeting cookies</li>
                <li>Social media sharing tracking</li>
                <li>Ad performance measurement</li>
                <li>Conversion tracking</li>
              </ul>
            </div>
          </div>

          {/* Personalization cookies */}
          <div className="cookie-type-card">
            <div className="cookie-type-header">
              <div>
                <h3>Personalization</h3>
                <p className="badge optional">Optional</p>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.personalization} 
                    onChange={() => handleCookieToggle('personalization')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="cookie-description">
              These cookies allow us to remember choices you make and provide enhanced, personalized features. 
              They may be used to provide you with targeted content based on your interests and browsing patterns.
            </p>
            <div className="cookie-examples">
              <h4>Examples:</h4>
              <ul>
                <li>Content recommendation cookies</li>
                <li>Personalized interface settings</li>
                <li>User preference tracking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="cookie-settings-save">
          <button 
            className="cookie-btn save-btn"
            onClick={handleSavePreferences}
          >
            Save Preferences
          </button>
        </div>

        {showSaveConfirmation && (
          <div className="save-confirmation">
            <div className="confirmation-icon"></div>
            <p>Your cookie preferences have been saved!</p>
          </div>
        )}

        <div className="cookie-policy-footer">
          <h3>About Our Cookie Policy</h3>
          <p>
            Our Cookie Policy is designed to inform you about how we use cookies on our website. Cookies 
            are small text files that are stored on your device when you visit a website. They help us 
            remember information about your visit, like your preferred language and other settings.
          </p>
          <p>
            You can change your cookie preferences at any time by visiting this page. Your choices will 
            be stored for one year, after which we'll ask for your preferences again.
          </p>
          <p>
            If you have questions about our cookie policy, please contact our privacy team at 
            <a href="mailto:privacy@travelworld.com"> privacy@travelworld.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;