import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';

/**
 * Main application content component that handles routing and page layout.
 * 
 * This component sets up the application's routing structure using React Router,
 * including both public and protected routes. It also applies scroll animations
 * and provides the main layout structure with navigation and content areas.
 * 
 * @component
 * @returns {JSX.Element} The main application layout with navigation and routed content
 * 
 * @example
 * // Usage within App component
 * function App() {
 *   return (
 *     <Router>
 *       <AppContent />
 *     </Router>
 *   );
 * }
 * 
 * @description
 * Routes included:
 * - "/" - Home page (public)
 * - "/login" - User login (public)
 * - "/register" - User registration (public)
 * - "/posts/:id" - Individual post view (public)
 * - "/search" - Search functionality (public)
 * - "/profile/:username" - User profile view (public)
 * - "/dashboard" - User dashboard (protected)
 * - "/create-post" - Post creation (protected)
 * - "/edit-post/:id" - Post editing (protected)
 * - "*" - 404 Not Found page (fallback)
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
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          
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
          <Link to="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            📊 Dashboard
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default App;