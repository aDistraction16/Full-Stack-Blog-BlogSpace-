import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PostCard component displays a blog post in a card format with metadata and actions.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.post - The post object to display
 * @param {string} props.post.id - Unique identifier for the post
 * @param {string} props.post.title - Title of the post
 * @param {string} props.post.content - Content/body of the post
 * @param {string} props.post.created_at - ISO date string when the post was created
 * @param {Object} props.post.author - Author information
 * @param {string} props.post.author.username - Username of the post author
 * @param {number} [props.post.comments_count] - Number of comments on the post
 * @param {boolean} [props.showActions=false] - Whether to show edit/delete action buttons
 * @param {Function} [props.onEdit] - Callback function when edit button is clicked
 * @param {Function} [props.onDelete] - Callback function when delete button is clicked
 * 
 * @returns {JSX.Element} A card component displaying post information with optional actions
 * 
 * @example
 * // Basic usage
 * <PostCard post={postObject} />
 * 
 * @example
 * // With actions for post management
 * <PostCard 
 *   post={postObject} 
 *   showActions={true}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <article className="card scroll-reveal">
      <div style={{ marginBottom: '1rem' }}>
        <h2 className="card-title">
          <Link 
            to={`/posts/${post.id}`}
            style={{ 
              color: 'var(--gray-800)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseOut={(e) => e.target.style.color = 'var(--gray-800)'}
          >
            {post.title}
          </Link>
        </h2>
        
        <div className="card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <strong>{post.author.username}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            {formatTimeAgo(post.created_at)}
          </span>
          {post.comments_count !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      
      {post.content && (
        <div className="card-content">
          <p>
            {post.content.length > 200 
              ? `${post.content.substring(0, 200)}...` 
              : post.content
            }
          </p>
        </div>
      )}
      
      <div className="card-actions">
        <Link 
          to={`/posts/${post.id}`}
          className="btn btn-primary"
          style={{ 
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          📖 Read More
        </Link>
        
        {showActions && (
          <>
            <button
              onClick={() => onEdit(post)}
              className="btn btn-secondary"
              style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.875rem'
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(post)}
              className="btn btn-danger"
              style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.875rem'
              }}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default PostCard;