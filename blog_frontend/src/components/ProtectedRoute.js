import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * A React component that protects routes by requiring user authentication.
 * Displays a loading spinner while authentication status is being determined,
 * redirects unauthenticated users to the login page, and renders child components
 * for authenticated users.
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render when user is authenticated
 * @returns {React.ReactElement} Loading spinner, navigation to login, or the protected child components
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;