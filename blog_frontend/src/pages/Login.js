import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Login component that renders a user authentication form.
 * 
 * Provides a login interface with username and password fields, handles form submission,
 * manages loading states, displays error messages, and redirects users after successful login.
 * Includes navigation to registration page for new users.
 * 
 * @component
 * @returns {JSX.Element} A login form with input fields, submit button, error handling, and registration link
 * 
 * @example
 * // Basic usage
 * <Login />
 * 
 * @requires useAuth - Custom hook for authentication functionality
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires useLocation - React Router hook for accessing current location state
 * @requires ErrorMessage - Component for displaying error messages
 * @requires LoadingSpinner - Component for showing loading state
 * 
 * @description
 * Features:
 * - Form validation with required fields
 * - Loading state management during authentication
 * - Error handling and display
 * - Redirect to intended page after login or default dashboard
 * - Responsive design with fade-in animation
 * - Link to registration page for new users
 */
const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="main-container">
      <div className="form-container fade-in">
        <div className="form-title">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your writing journey</p>
        </div>
        
        <ErrorMessage message={error} onClose={() => setError('')} />
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? <LoadingSpinner size="small" /> : '🚀 Sign In'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Don't have an account? {' '}
            <Link to="/register" style={{ fontWeight: '600' }}>
              🚀 Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;