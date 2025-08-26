import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PostCard component displays a blog post in a card format with optional actions.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.post - The post object to display
 * @param {string} props.post.id - Unique identifier for the post
 * @param {string} props.post.title - Title of the post
 * @param {string} props.post.content - Content/body of the post
 * @param {string} props.post.created_at - ISO date string of when the post was created
 * @param {Object} props.post.author - Author information object
 * @param {string} props.post.author.username - Username of the post author
 * @param {number} [props.post.comments_count] - Number of comments on the post
 * @param {boolean} [props.showActions=false] - Whether to show edit/delete action buttons
 * @param {Function} [props.onEdit] - Callback function called when edit button is clicked
 * @param {Function} [props.onDelete] - Callback function called when delete button is clicked
 * @returns {JSX.Element} A card component displaying the post information
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-2">
        <Link 
          to={`/posts/${post.id}`}
          className="text-gray-800 hover:text-blue-600"
        >
          {post.title}
        </Link>
      </h2>
      
      <div className="text-gray-600 text-sm mb-3">
        By {post.author.username} on {formatDate(post.created_at)}
        {post.comments_count !== undefined && (
          <span className="ml-4">
            {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {post.content && (
        <p className="text-gray-700 mb-4">
          {post.content.length > 200 
            ? `${post.content.substring(0, 200)}...` 
            : post.content
          }
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <Link 
          to={`/posts/${post.id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          Read more →
        </Link>
        
        {showActions && (
          <div className="space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;