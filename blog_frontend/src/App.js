import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useScrollAnimation } from './hooks/useScrollAnimation';
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

/**
 * Main application content component that handles routing and page layout.
 * 
 * This component sets up the primary routing structure for the blog platform,
 * including public routes (home, login, register, post details), protected routes
 * (dashboard, create/edit posts), and a catch-all 404 route. It also applies
 * scroll animations and provides the main layout structure with navigation.
 * 
 * @component
 * @returns {JSX.Element} The main application content with navigation and routed pages
 * 
 * @example
 * // Used within the main App component
 * function App() {
 *   return (
 *     <Router>
 *       <AppContent />
 *     </Router>
 *   );
 * }
 * 
 * @see {@link Navigation} - Top navigation component
 * @see {@link ProtectedRoute} - Route wrapper for authenticated users only
 * @see {@link useScrollAnimation} - Custom hook for scroll-based animations
 */
function AppContent() {
  useScrollAnimation();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />
      <main>
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Enhanced 404 Component
const NotFound = () => (
  <div className="main-container">
    <div className="card text-center fade-in">
      <div style={{ padding: '4rem 2rem' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🌌</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-800)' }}>
          404 - Lost in Space
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          The page you're looking for seems to have drifted away into the digital cosmos.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" className="btn btn-primary">
            🏠 Go Home
          </a>
          <a href="/dashboard" className="btn btn-secondary">
            📊 Dashboard
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default App;