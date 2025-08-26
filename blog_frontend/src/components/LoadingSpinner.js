import React from 'react';

/**
 * A customizable loading spinner component that displays a rotating animation
 * to indicate loading or processing states.
 * 
 * @param {Object} props - The component props
 * @param {string} [props.size='medium'] - The size of the spinner. Can be 'small', 'medium', or 'large'
 * @param {string} [props.color='currentColor'] - The color of the spinner's top border
 * @returns {JSX.Element} A centered loading spinner element
 * 
 * @example
 * // Default medium spinner
 * <LoadingSpinner />
 * 
 * @example
 * // Large red spinner
 * <LoadingSpinner size="large" color="#ff0000" />
 * 
 * @example
 * // Small blue spinner
 * <LoadingSpinner size="small" color="blue" />
 */
const LoadingSpinner = ({ size = 'medium', color = 'currentColor' }) => {
  const getSpinnerClass = () => {
    switch(size) {
      case 'small': return 'spinner spinner-small';
      case 'large': return 'spinner spinner-large';
      default: return 'spinner spinner-medium';
    }
  };

  return (
    <div className="text-center">
      <div 
        className={getSpinnerClass()}
        style={{ 
          borderTopColor: color,
          margin: '0 auto'
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;