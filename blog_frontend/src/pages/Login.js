import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Login component that provides user authentication functionality.
 * 
 * Renders a login form with username and password fields, handles form submission,
 * manages loading states, displays error messages, and redirects users after successful login.
 * Uses authentication context for login operations and navigation for routing.
 * 
 * @component
 * @returns {JSX.Element} A login form with input fields, submit button, error handling, and registration link
 * 
 * @example
 * // Basic usage in a route
 * <Route path="/login" element={<Login />} />
 * 
 * @requires useAuth - Authentication context hook for login functionality
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires useLocation - React Router hook to access current location state
 * @requires ErrorMessage - Component to display error messages
 * @requires LoadingSpinner - Component to show loading state
 * @requires Link - React Router component for navigation links
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="small" /> : 'Login'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-gray-600">
        Don't have an account? {' '}
        <Link to="/register" className="text-blue-500 hover:text-blue-700">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;