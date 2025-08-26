import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PostCard component displays a blog post in a card layout with metadata and actions.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.post - The post object containing post data
 * @param {number} props.post.id - Unique identifier for the post
 * @param {string} props.post.title - Title of the post
 * @param {string} props.post.content - Content/body of the post
 * @param {string} props.post.created_at - ISO date string when post was created
 * @param {number} props.post.comments_count - Number of comments on the post
 * @param {Object} props.post.author - Author information object
 * @param {string} props.post.author.username - Username of the post author
 * @param {boolean} [props.showActions=false] - Whether to show edit/delete action buttons
 * @param {Function} [props.onEdit] - Callback function when edit button is clicked
 * @param {Function} [props.onDelete] - Callback function when delete button is clicked
 * 
 * @returns {JSX.Element|null} Rendered post card component or null if no post provided
 * 
 * @example
 * // Basic usage
 * <PostCard post={postData} />
 * 
 * @example
 * // With actions enabled
 * <PostCard 
 *   post={postData} 
 *   showActions={true}
 *   onEdit={(post) => handleEdit(post)}
 *   onDelete={(post) => handleDelete(post)}
 * />
 */
const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  if (!post) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const now = new Date();
      const postDate = new Date(dateString);
      const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return formatDate(dateString);
    } catch (error) {
      return 'Unknown time';
    }
  };

  const authorName = post.author?.username || 'Unknown Author';
  const postTitle = post.title || 'Untitled Post';
  const postContent = post.content || '';
  const commentsCount = post.comments_count || 0;

  return (
    <article style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '0.5rem',
          lineHeight: '1.3'
        }}>
          <Link 
            to={`/posts/${post.id}`}
            style={{ 
              color: '#1F2937',
              textDecoration: 'none'
            }}
          >
            {postTitle}
          </Link>
        </h2>
        
        {/* Meta info */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.875rem',
          color: '#6B7280',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>👤</span>
            <Link 
              to={`/profile/${post.author?.username || 'unknown'}`}
              style={{ 
                fontWeight: '600',
                color: '#4F46E5',
                textDecoration: 'none'
              }}
            >
              {authorName}
            </Link>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>📅</span>
            {formatTimeAgo(post.created_at)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>💬</span>
            {commentsCount} comment{commentsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {/* Content */}
      {postContent && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{
            color: '#374151',
            lineHeight: '1.6',
            fontSize: '1rem'
          }}>
            {postContent.length > 200 
              ? `${postContent.substring(0, 200)}...` 
              : postContent
            }
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <Link 
          to={`/posts/${post.id}`}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            textDecoration: 'none',
            background: '#4F46E5',
            color: 'white',
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          📖 Read More
        </Link>
        
        {showActions && (
          <>
            <button
              onClick={() => onEdit && onEdit(post)}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                background: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(post)}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                background: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
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