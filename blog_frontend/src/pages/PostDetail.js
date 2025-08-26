import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * PostDetail component for displaying a single blog post with its comments.
 * 
 * This component handles the full post view including:
 * - Loading and displaying post content with author information and timestamps
 * - Comment submission functionality for authenticated users
 * - Comment display with author and timestamp information
 * - Edit access for post authors
 * - Error handling and loading states
 * 
 * @component
 * @returns {JSX.Element} The rendered post detail page
 * 
 * @requires useParams - React Router hook to get post ID from URL
 * @requires useAuth - Custom hook for authentication state and user data
 * @requires useState - React hook for component state management
 * @requires useEffect - React hook for side effects
 * 
 * @example
 * // Route configuration
 * <Route path="/post/:id" element={<PostDetail />} />
 * 
 * @description
 * Features:
 * - Responsive post display with formatted content
 * - Time-based date formatting (relative and absolute)
 * - Authentication-gated comment submission
 * - Author-only edit access
 * - Loading spinners and error messages
 * - Success notifications for comments
 * - Fallback UI for non-existent posts
 */
const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState('');
  
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      setPost(response.data);
    } catch (err) {
      setError('Failed to fetch post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const response = await commentsAPI.create(id, { content: commentText });
      setPost({
        ...post,
        comments: [...post.comments, response.data]
      });
      setCommentText('');
      setCommentSuccess('💬 Comment added successfully!');
      setTimeout(() => setCommentSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center" style={{ paddingTop: '4rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Loading story...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="main-container">
        <div className="card text-center">
          <div style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Story Not Found</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
              The story you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/" className="btn btn-primary">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/" 
          className="btn btn-secondary"
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          ← Back to Stories
        </Link>
      </div>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={commentSuccess} onClose={() => setCommentSuccess('')} />
      
      {/* Article */}
      <article className="card">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            color: 'var(--gray-800)',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            {post.title}
          </h1>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                  {post.author.username}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  Author
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                  {formatTimeAgo(post.created_at)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  Published
                </div>
              </div>
            </div>
            
            {post.updated_at !== post.created_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✏️</span>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                    {formatTimeAgo(post.updated_at)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Updated
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div style={{ 
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: 'var(--gray-700)',
          marginBottom: '2rem'
        }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '1.5rem' }}>
              {paragraph}
            </p>
          ))}
        </div>
        
        {isAuthenticated && user.id === post.author.id && (
          <div style={{ 
            paddingTop: '2rem',
            borderTop: '1px solid var(--gray-200)',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Link 
              to={`/edit-post/${post.id}`}
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              ✏️ Edit Story
            </Link>
          </div>
        )}
      </article>
      
      {/* Comments Section */}
      <section className="comments-section">
        <div className="card">
          <h2 style={{ 
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--gray-800)'
          }}>
            💬 Comments ({post.comments.length})
          </h2>
          
          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--gray-700)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💭 Add your thoughts
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  className="form-textarea"
                  placeholder="Share your thoughts about this story..."
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="btn btn-primary"
              >
                {commentLoading ? <LoadingSpinner size="small" /> : '💬 Post Comment'}
              </button>
            </form>
          ) : (
            <div style={{ 
              padding: '2rem',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
              <p style={{ 
                color: 'var(--gray-700)',
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                Join the conversation! Sign in to share your thoughts.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/login" className="btn btn-primary">
                  🔑 Sign In
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  🚀 Join Now
                </Link>
              </div>
            </div>
          )}
          
          {/* Comments List */}
          {post.comments.length === 0 ? (
            <div style={{ 
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--gray-600)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
              <p style={{ fontSize: '1.1rem' }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>👤</span>
                      <span className="comment-author">{comment.author.username}</span>
                    </div>
                    <span className="comment-date">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;