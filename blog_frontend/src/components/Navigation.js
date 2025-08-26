import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation component that renders the main navigation bar for the blog platform.
 * 
 * Displays different navigation options based on user authentication status:
 * - For authenticated users: Dashboard, Create Post, Welcome message, and Logout button
 * - For unauthenticated users: Login and Register links
 * 
 * Uses React Router for navigation and integrates with authentication context
 * to manage user state and logout functionality.
 * 
 * @component
 * @returns {JSX.Element} The rendered navigation bar with responsive layout
 * 
 * @requires useAuth - Custom hook for authentication state management
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires Link - React Router component for client-side navigation
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
          Blog Platform
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/create-post" className="nav-link">
                Create Post
              </Link>
              <span style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>
                Welcome, {user.username}!
              </span>
              <button 
                onClick={handleLogout}
                className="nav-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;