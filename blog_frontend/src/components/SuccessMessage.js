import React from 'react';

/**
 * SuccessMessage component displays a success alert with optional close functionality.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.message - The success message to display. If falsy, component returns null
 * @param {Function} [props.onClose] - Optional callback function to handle closing the message
 * @returns {JSX.Element|null} A success alert element with checkmark icon and optional close button, or null if no message
 * 
 * @example
 * // Basic usage with message only
 * <SuccessMessage message="Operation completed successfully!" />
 * 
 * @example
 * // With close functionality
 * <SuccessMessage 
 *   message="Data saved successfully!" 
 *   onClose={() => setSuccessMessage('')} 
 * />
 */
const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-success">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>✅</span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--success-color)',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;