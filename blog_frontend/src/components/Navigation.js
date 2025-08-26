import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation component that renders the main navigation bar for the blog platform.
 * Displays different navigation options based on user authentication status.
 * 
 * @component
 * @returns {JSX.Element} The navigation bar component
 * 
 * @description
 * This component provides:
 * - Logo/brand link to home page
 * - Home navigation link
 * - Authenticated users: Dashboard, Write Post, user welcome message, and logout button
 * - Unauthenticated users: Login and Register links
 * 
 * @requires useAuth - Custom hook for authentication state management
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires Link - React Router component for navigation links
 * 
 * @example
 * // Usage in a layout component
 * <Navigation />
 */
const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✨ BlogSpace
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                📊 Dashboard
              </Link>
              <Link to="/create-post" className="nav-link">
                ✍️ Write
              </Link>
              <span className="user-welcome">
                👋 {user.username}
              </span>
              <button 
                onClick={handleLogout}
                className="nav-button"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                🔑 Login
              </Link>
              <Link to="/register" className="nav-button">
                🚀 Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;