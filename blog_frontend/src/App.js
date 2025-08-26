import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const EditPost = React.lazy(() => import('./pages/EditPost'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Search = React.lazy(() => import('./pages/Search'));

/**
 * Main application component that sets up the routing structure and global providers.
 * 
 * This component wraps the entire application with essential providers and context:
 * - ErrorBoundary for error handling
 * - AuthProvider for authentication state management
 * - Router for client-side routing
 * - Suspense for lazy loading with a loading spinner fallback
 * 
 * The component defines routes for:
 * - Home page (/)
 * - Authentication (login, register)
 * - Post management (view, create, edit)
 * - User features (dashboard, profile, search)
 * 
 * @component
 * @returns {JSX.Element} The main App component with routing and providers
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Suspense fallback={<LoadingSpinner size="large" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;