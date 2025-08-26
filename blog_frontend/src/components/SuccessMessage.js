import React from 'react';

/**
 * A React component that displays a success message with optional close functionality.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.message - The success message to display. If falsy, component returns null.
 * @param {Function} [props.onClose] - Optional callback function called when the close button is clicked
 * @returns {JSX.Element|null} A styled success message div with green styling, or null if no message
 * 
 * @example
 * // Basic usage with message only
 * <SuccessMessage message="Operation completed successfully!" />
 * 
 * @example
 * // With close button
 * <SuccessMessage 
 *   message="Data saved successfully!" 
 *   onClose={() => setMessage('')} 
 * />
 */
const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-green-700 hover:text-green-900"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;