import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Home component - Main landing page for the BlogSpace application
 * 
 * Displays a hero section with welcome message and authentication buttons for non-authenticated users,
 * followed by a paginated list of blog posts. Handles loading states, error messages, and provides
 * navigation for creating new posts for authenticated users.
 * 
 * @component
 * @returns {JSX.Element} The rendered Home page component
 * 
 * @example
 * // Basic usage in routing
 * <Route path="/" element={<Home />} />
 * 
 * @description
 * Features:
 * - Hero section with call-to-action buttons for unauthenticated users
 * - Paginated blog posts display with loading states
 * - Error handling with dismissible error messages
 * - Responsive design with smooth scrolling pagination
 * - Conditional rendering based on authentication status
 * - Empty state handling when no posts are available
 * 
 * @dependencies
 * - useAuth hook for authentication state
 * - postsAPI for fetching blog posts
 * - PostCard component for individual post display
 * - LoadingSpinner component for loading states
 * - ErrorMessage component for error display
 */
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(page);
      setPosts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        current: page
      });
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center" style={{ paddingTop: '4rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container fade-in">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to BlogSpace</h1>
        <p>
          Discover amazing stories, share your thoughts, and connect with writers from around the world.
          Join our vibrant community of creators and readers.
        </p>
        {!isAuthenticated && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">
              🚀 Start Writing Today
            </Link>
            <Link to="/login" className="btn btn-secondary">
              🔑 Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            color: 'white',
            margin: 0
          }}>
            📚 Latest Stories
          </h2>
          {isAuthenticated && (
            <Link to="/create-post" className="btn btn-primary">
              ✍️ Write Story
            </Link>
          )}
        </div>
        
        <ErrorMessage message={error} onClose={() => setError('')} />
        
        {posts.length === 0 ? (
          <div className="card text-center">
            <div style={{ padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>
                No stories yet
              </h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                Be the first to share your amazing story with the community!
              </p>
              {isAuthenticated && (
                <Link to="/create-post" className="btn btn-primary">
                  ✍️ Write First Story
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="scroll-reveal active">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* Enhanced Pagination */}
            {pagination.count > 10 && (
              <div className="pagination">
                {pagination.previous && (
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                )}
                <span className="pagination-btn" style={{ background: 'var(--primary-color)', color: 'white' }}>
                  Page {pagination.current}
                </span>
                {pagination.next && (
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;