import React from 'react';

/**
 * A loading spinner component that displays a spinning animation to indicate loading state.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {('small'|'medium'|'large')} [props.size='medium'] - The size of the spinner
 * @returns {JSX.Element} A div containing the loading spinner with appropriate styling
 * 
 * @example
 * // Default medium spinner
 * <LoadingSpinner />
 * 
 * @example
 * // Small spinner
 * <LoadingSpinner size="small" />
 * 
 * @example
 * // Large spinner
 * <LoadingSpinner size="large" />
 */
const LoadingSpinner = ({ size = 'medium' }) => {
  const getSpinnerClass = () => {
    switch(size) {
      case 'small': return 'spinner spinner-small';
      case 'large': return 'spinner spinner-large';
      default: return 'spinner spinner-medium';
    }
  };

  return (
    <div className="text-center">
      <div className={getSpinnerClass()}></div>
    </div>
  );
};

export default LoadingSpinner;