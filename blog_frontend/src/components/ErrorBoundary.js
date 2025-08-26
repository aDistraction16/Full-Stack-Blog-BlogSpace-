import React from 'react';

/**
 * React Error Boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @class ErrorBoundary
 * @extends {React.Component}
 * 
 * @description This component implements React's error boundary pattern to gracefully handle
 * runtime errors in the component tree. When an error occurs, it displays a user-friendly
 * error message with optional error details in a collapsible section.
 * 
 * @example
 * // Wrap components that might throw errors
 * <ErrorBoundary>
 *   <SomeComponentThatMightCrash />
 * </ErrorBoundary>
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the error boundary
 * 
 * @state
 * @property {boolean} hasError - Flag indicating whether an error has been caught
 * @property {Error|null} error - The caught error object, null if no error
 * 
 * @method getDerivedStateFromError
 * @static
 * @param {Error} error - The error that was thrown
 * @returns {Object} New state object with hasError set to true and the error stored
 * 
 * @method componentDidCatch
 * @param {Error} error - The error that was thrown
 * @param {Object} errorInfo - Object containing component stack trace information
 * @description Logs error details to the console for debugging purposes
 * 
 * @method render
 * @returns {React.ReactElement|React.ReactNode} Either the error UI or the wrapped children
 * @description Renders error fallback UI when hasError is true, otherwise renders children
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2>🚫 Something went wrong!</h2>
          <p>Please refresh the page or contact support.</p>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;