import React from 'react';

/**
 * ErrorMessage component displays error messages with optional close functionality.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string|null} props.message - The error message to display. If null or falsy, component returns null
 * @param {Function} [props.onClose] - Optional callback function called when the close button is clicked
 * @returns {JSX.Element|null} Returns the error message JSX element or null if no message is provided
 * 
 * @example
 * // Basic usage with message only
 * <ErrorMessage message="Something went wrong!" />
 * 
 * @example
 * // With close functionality
 * <ErrorMessage 
 *   message="Login failed. Please try again." 
 *   onClose={() => setError(null)} 
 * />
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>❌</span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--error-color)',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;