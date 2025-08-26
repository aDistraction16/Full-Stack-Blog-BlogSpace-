import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * Dashboard component that displays a user's blog management interface.
 * 
 * Provides an overview of user statistics, displays all user posts, and allows
 * post management operations including editing and deletion. Features a welcome
 * section, statistics cards showing post counts and engagement metrics, and
 * a responsive grid layout for post display.
 * 
 * @component
 * @returns {JSX.Element} The rendered dashboard interface
 * 
 * @example
 * // Basic usage in a route
 * <Route path="/dashboard" element={<Dashboard />} />
 * 
 * @description
 * Key features:
 * - User welcome section with quick action to create new posts
 * - Statistics cards displaying total posts, views, and comments
 * - Post management interface with edit/delete capabilities
 * - Loading states and error handling
 * - Empty state with call-to-action for new users
 * - Confirmation dialogs for destructive actions
 * 
 * @requires useAuth - Authentication context hook for user data
 * @requires useNavigate - React Router navigation hook
 * @requires postsAPI - API service for post operations
 * @requires PostCard - Component for displaying individual posts
 * @requires LoadingSpinner - Loading indicator component
 * @requires ErrorMessage - Error display component
 * @requires SuccessMessage - Success notification component
 * 
 * @state {Array} posts - Array of user's blog posts
 * @state {boolean} loading - Loading state for initial data fetch
 * @state {string} error - Error message for display
 * @state {string} success - Success message for display
 * @state {number|null} deleteLoading - ID of post currently being deleted
 * @state {Object} stats - User statistics (totalPosts, totalViews, totalComments)
 */
const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getUserPosts();
      const userPosts = response.data.results || response.data;
      setPosts(userPosts);
      
      // Calculate stats
      const totalComments = userPosts.reduce((sum, post) => sum + (post.comments_count || 0), 0);
      setStats({
        totalPosts: userPosts.length,
        totalViews: userPosts.length * 15, // Mock view count
        totalComments
      });
    } catch (err) {
      setError('Failed to fetch your posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    navigate(`/edit-post/${post.id}`);
  };

  const handleDelete = async (post) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(post.id);
    try {
      await postsAPI.delete(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
      setSuccess('Post deleted successfully! 🗑️');
      setTimeout(() => setSuccess(''), 3000);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1
      }));
    } catch (err) {
      setError('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center" style={{ paddingTop: '4rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container fade-in">
      {/* Welcome Header */}
      <div className="hero" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>
          Welcome back, {user.username}! 👋
        </h1>
        <p style={{ fontSize: '1.1rem' }}>
          Ready to create something amazing today?
        </p>
        <Link to="/create-post" className="btn btn-primary">
          ✍️ Write New Story
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="stats-card">
          <div className="stats-number">{stats.totalPosts}</div>
          <div className="stats-label">📝 Stories Written</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{stats.totalViews}</div>
          <div className="stats-label">👀 Total Views</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{stats.totalComments}</div>
          <div className="stats-label">💬 Comments Received</div>
        </div>
      </div>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      
      {/* Posts Section */}
      <div style={{ marginTop: '3rem' }}>
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
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📚 Your Stories ({posts.length})
          </h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="card text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ 
                marginBottom: '1rem', 
                color: 'var(--gray-700)',
                fontSize: '1.5rem'
              }}>
                No stories yet
              </h3>
              <p style={{ 
                color: 'var(--gray-600)', 
                marginBottom: '2rem',
                fontSize: '1.1rem',
                maxWidth: '400px',
                margin: '0 auto 2rem'
              }}>
                Your writing journey starts here! Share your thoughts, experiences, and creativity with our community.
              </p>
              <Link to="/create-post" className="btn btn-primary">
                ✍️ Write Your First Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="scroll-reveal active">
            {posts.map(post => (
              <div key={post.id} style={{ position: 'relative' }}>
                {deleteLoading === post.id && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    borderRadius: '20px',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <LoadingSpinner />
                      <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>
                        Deleting post...
                      </p>
                    </div>
                  </div>
                )}
                <PostCard 
                  post={post}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;