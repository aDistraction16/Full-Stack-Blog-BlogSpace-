/**
 * Main application component that sets up routing and authentication context.
 * 
 * This component serves as the root of the blog platform application, providing:
 * - Authentication context for the entire app
 * - React Router setup with both public and protected routes
 * - Navigation component and main layout structure
 * - Route definitions for all pages including 404 handling
 * 
 * @component
 * @returns {JSX.Element} The main application component with routing and layout
 * 
 * @example
 * // Usage in index.js
 * import App from './App';
 * 
 * ReactDOM.render(<App />, document.getElementById('root'));
 */

/**
 * 404 Not Found component displayed when users navigate to non-existent routes.
 * 
 * @component
 * @returns {JSX.Element} A centered error message indicating the page was not found
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-post" 
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-post/:id" 
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// 404 Component
const NotFound = () => (
  <div className="text-center py-8">
    <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
  </div>
);

export default App;