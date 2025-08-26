import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

/**
 * Home component - Main landing page for the blog platform
 * 
 * Displays a hero section with welcome message and call-to-action buttons,
 * followed by a paginated list of blog posts. Handles loading states,
 * error messages, and provides different UI based on authentication status.
 * 
 * @component
 * @returns {JSX.Element} The rendered home page component
 * 
 * @example
 * // Basic usage in App component
 * <Route path="/" element={<Home />} />
 * 
 * @description
 * Features:
 * - Hero section with gradient background and emoji decorations
 * - Authentication-aware UI (different buttons for logged in/out users)
 * - Paginated blog posts with loading spinner
 * - Error handling with dismissible error messages
 * - Empty state with call-to-action when no posts exist
 * - Responsive design with smooth scrolling on page changes
 * - Post count display in section header
 * 
 * @requires useAuth - Custom hook for authentication state
 * @requires postsAPI - API service for fetching posts
 * @requires PostCard - Component for rendering individual posts
 * @requires LoadingSpinner - Component for loading states
 * @requires Link - React Router Link component for navigation
 * 
 * @state {Array} posts - Array of blog post objects
 * @state {boolean} loading - Loading state for API requests
 * @state {string} error - Error message string
 * @state {Object} pagination - Pagination metadata (count, totalPages, currentPage, hasNext, hasPrevious)
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
      setError('');
      
      const response = await postsAPI.getAll(page);
      
      if (response.data && response.data.results) {
        setPosts(response.data.results);
        setPagination({
          count: response.data.count || 0,
          totalPages: Math.ceil((response.data.count || 0) / 10),
          currentPage: page,
          hasNext: !!response.data.next,
          hasPrevious: !!response.data.previous
        });
      } else if (Array.isArray(response.data)) {
        setPosts(response.data);
        setPagination({});
      } else {
        setPosts([]);
        setError('Unexpected response format from server');
      }
    } catch (err) {
      console.error('❌ Fetch posts error:', err);
      setError(`Failed to load posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        minHeight: '90vh'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          color: 'white'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Welcome to BlogSpace
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Discover amazing stories from our community of writers
          </p>
          
          {!isAuthenticated && (
            <div style={{ marginTop: '2rem' }}>
              <Link 
                to="/register" 
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '1rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                🚀 Join Our Community
              </Link>
              <Link 
                to="/login"
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                🔑 Sign In
              </Link>
            </div>
          )}
          
          {isAuthenticated && (
            <div style={{ marginTop: '2rem' }}>
              <Link 
                to="/create-post"
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                ✍️ Share Your Story
              </Link>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #FECACA'
          }}>
            {error}
            <button 
              onClick={() => setError('')}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Posts Section */}
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            📖 Latest Stories ({posts?.length || 0} found)
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <LoadingSpinner size="large" />
              <p style={{ marginTop: '1rem', color: '#6B7280' }}>
                Loading amazing stories...
              </p>
            </div>
          ) : posts && posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ 
                marginBottom: '1rem', 
                color: '#374151',
                fontSize: '1.5rem'
              }}>
                No stories yet
              </h3>
              <p style={{ 
                color: '#6B7280', 
                marginBottom: '2rem',
                fontSize: '1.1rem'
              }}>
                Be the first to share your story with our community!
              </p>
              {isAuthenticated ? (
                <Link 
                  to="/create-post"
                  style={{
                    display: 'inline-block',
                    background: '#4F46E5',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  ✍️ Write the First Story
                </Link>
              ) : (
                <Link 
                  to="/register"
                  style={{
                    display: 'inline-block',
                    background: '#4F46E5',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  🚀 Join to Write Stories
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Posts List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {posts.map((post, index) => (
                  <PostCard 
                    key={post.id || `post-${index}`} 
                    post={post} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '3rem',
                  padding: '2rem 0'
                }}>
                  {pagination.hasPrevious && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      style={{
                        background: '#F3F4F6',
                        color: '#374151',
                        border: '2px solid #E5E7EB',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      ← Previous
                    </button>
                  )}
                  <span style={{
                    background: '#4F46E5',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '2px solid #4F46E5'
                  }}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  {pagination.hasNext && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      style={{
                        background: '#F3F4F6',
                        color: '#374151',
                        border: '2px solid #E5E7EB',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
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
    </div>
  );
};

export default Home;