import React from 'react';

/**
 * ErrorMessage component displays an error alert with an optional close button.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.message - The error message to display. If falsy, component returns null
 * @param {Function} [props.onClose] - Optional callback function called when close button is clicked
 * @returns {JSX.Element|null} Returns the error message alert or null if no message provided
 * 
 * @example
 * // Basic usage with message only
 * <ErrorMessage message="Something went wrong!" />
 * 
 * @example
 * // With close functionality
 * <ErrorMessage 
 *   message="Network error occurred" 
 *   onClose={() => setError(null)} 
 * />
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#dc2626'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;