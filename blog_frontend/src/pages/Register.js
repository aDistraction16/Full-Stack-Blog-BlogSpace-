import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Register component for user registration functionality.
 * 
 * This component provides a registration form that allows new users to create an account
 * by providing username, email, password, and password confirmation. It handles form
 * validation, error display, and redirects to dashboard upon successful registration.
 * 
 * @component
 * @returns {JSX.Element} A registration form with input fields for user credentials,
 *                        error handling, loading state, and navigation to login page
 * 
 * @example
 * // Basic usage in a route
 * <Route path="/register" element={<Register />} />
 * 
 * @requires useAuth - Custom hook for authentication operations
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires useState - React hook for state management
 * @requires ErrorMessage - Component for displaying error messages
 * @requires LoadingSpinner - Component for showing loading state
 * @requires Link - React Router component for navigation links
 * 
 * @description
 * Features:
 * - Real-time form validation with error clearing on input change
 * - Comprehensive error handling for both field-specific and general errors
 * - Loading state management during registration process
 * - Responsive design with fade-in animation
 * - Emoji-enhanced UI for better user experience
 * - Automatic redirect to dashboard on successful registration
 * - Link to login page for existing users
 */
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (typeof result.error === 'string') {
        setGeneralError(result.error);
      } else if (typeof result.error === 'object') {
        if (result.error.non_field_errors) {
          setGeneralError(result.error.non_field_errors[0] || result.error.non_field_errors);
        } else {
          setErrors(result.error);
        }
      } else {
        setGeneralError('Registration failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="main-container">
      <div className="form-container fade-in">
        <div className="form-title">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2>Join BlogSpace</h2>
          <p>Start your writing journey today and connect with amazing writers</p>
        </div>
        
        {generalError && (
          <ErrorMessage message={generalError} onClose={() => setGeneralError('')} />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a unique username"
              required
            />
            {errors.username && (
              <span className="field-error">
                ❌ {Array.isArray(errors.username) ? errors.username[0] : errors.username}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <span className="field-error">
                ❌ {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a strong password"
              required
            />
            {errors.password && (
              <span className="field-error">
                ❌ {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">🔒 Confirm Password</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
            {errors.password_confirm && (
              <span className="field-error">
                ❌ {Array.isArray(errors.password_confirm) ? errors.password_confirm[0] : errors.password_confirm}
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? <LoadingSpinner size="small" /> : '🚀 Create Account'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Already have an account? {' '}
            <Link to="/login" style={{ fontWeight: '600' }}>
              🔑 Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;