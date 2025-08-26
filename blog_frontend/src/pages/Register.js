import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Register component for user registration functionality.
 * 
 * Provides a registration form with username, email, password, and password confirmation fields.
 * Handles form validation, error display, and user registration through the authentication context.
 * Redirects to dashboard upon successful registration.
 * 
 * @component
 * @returns {JSX.Element} A registration form with input fields, validation, and submit functionality
 * 
 * @example
 * // Basic usage
 * <Register />
 * 
 * @description
 * Features:
 * - Form state management for user input
 * - Real-time field validation and error clearing
 * - Loading state management during registration
 * - Multiple error handling formats (string, object, Django validation errors)
 * - General error display component integration
 * - Responsive form styling
 * - Navigation to dashboard on success
 * - Link to login page for existing users
 * 
 * State:
 * - formData: Object containing username, email, password, password_confirm
 * - loading: Boolean indicating registration in progress
 * - errors: Object containing field-specific validation errors
 * - generalError: String for general error messages
 * 
 * Dependencies:
 * - useAuth hook for registration functionality
 * - useNavigate hook for programmatic navigation
 * - ErrorMessage component for error display
 * - LoadingSpinner component for loading state
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
    // Clear field error when user starts typing
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
      // Handle different error formats
      if (typeof result.error === 'string') {
        setGeneralError(result.error);
      } else if (typeof result.error === 'object') {
        // Handle Django validation errors
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
    <div className="form-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Create Account
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Join our blog community today
        </p>
      </div>
      
      {generalError && (
        <ErrorMessage message={generalError} onClose={() => setGeneralError('')} />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your username"
            required
          />
          {errors.username && (
            <span className="field-error">
              {Array.isArray(errors.username) ? errors.username[0] : errors.username}
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <span className="field-error">
              {Array.isArray(errors.email) ? errors.email[0] : errors.email}
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Create a password"
            required
          />
          {errors.password && (
            <span className="field-error">
              {Array.isArray(errors.password) ? errors.password[0] : errors.password}
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
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
              {Array.isArray(errors.password_confirm) ? errors.password_confirm[0] : errors.password_confirm}
            </span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ 
            width: '100%',
            marginTop: '1rem'
          }}
        >
          {loading ? <LoadingSpinner size="small" /> : 'Create Account'}
        </button>
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Already have an account? {' '}
          <Link 
            to="/login" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;