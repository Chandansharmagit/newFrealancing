import { useState } from "react";
import "./LoginDashboardAuth.css"; // Assuming you'll add CSS for styling

const LoginDashboardAuth = ({ isOpen, onClose, onAuthenticate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUsername = "travelsansr";
    const validPassword = "travelsansr@#";

    if (username === validUsername && password === validPassword) {
      onAuthenticate(true);
      setError("");
      onClose(); // Close the popup on successful login
    } else {
      setError("Invalid username or password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-dashboard-popup">
      <div className="login-dashboard-content">
        <h2>Dashboard Authentication</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginDashboardAuth;