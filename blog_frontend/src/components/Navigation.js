import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

/**
 * Navigation component that renders the main navigation bar for the blog platform.
 * 
 * This component provides different navigation options based on user authentication status:
 * - For authenticated users: Dashboard, Write, Profile, Welcome message, and Logout
 * - For unauthenticated users: Login and Register links
 * - Common elements: Home link, Logo, and Search bar
 * 
 * @component
 * @returns {JSX.Element} The navigation bar with responsive layout and authentication-based menu items
 * 
 * @example
 * // Basic usage in App component
 * <Navigation />
 * 
 * @requires useAuth - Custom hook for authentication state and logout functionality
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires SearchBar - Component for search functionality
 * @requires Link - React Router component for navigation links
 * 
 * @description
 * The component structure includes:
 * - Logo/Brand link to home page
 * - Centered search bar for desktop layout
 * - Dynamic navigation links based on authentication status
 * - User welcome message and logout functionality for authenticated users
 * - Login and registration links for unauthenticated users
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
        
        {/* Search Bar - Desktop */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          maxWidth: '500px',
          margin: '0 2rem'
        }}>
          <SearchBar />
        </div>
        
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
              <Link to={`/profile/${user.username}`} className="nav-link">
                👤 Profile
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