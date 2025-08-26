import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * PostDetail component that displays a single blog post with its details and comments section.
 * 
 * This component fetches and displays a blog post by ID, including the post content, author information,
 * creation/update dates, and associated comments. It also provides functionality for authenticated users
 * to add new comments and for post authors to edit their posts.
 * 
 * @component
 * @example
 * // Used in routing to display a specific post
 * <Route path="/post/:id" element={<PostDetail />} />
 * 
 * @requires useParams - React Router hook to get the post ID from URL parameters
 * @requires useAuth - Custom hook to get authentication state and user information
 * @requires postsAPI - API service for fetching post data
 * @requires commentsAPI - API service for creating comments
 * 
 * @returns {JSX.Element} A detailed post view with comments section
 * 
 * @description
 * Features:
 * - Displays post title, content, author, and timestamps
 * - Shows edit button for post authors when authenticated
 * - Renders comments with author and timestamp information
 * - Provides comment form for authenticated users
 * - Handles loading states and error messages
 * - Includes navigation back to posts list
 * - Formats dates in a user-friendly format
 * - Supports multi-paragraph content rendering
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
      setCommentSuccess('Comment added successfully!');
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message="Post not found." />
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
        ← Back to Posts
      </Link>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={commentSuccess} onClose={() => setCommentSuccess('')} />
      
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-gray-600 mb-6">
          By {post.author.username} on {formatDate(post.created_at)}
          {post.updated_at !== post.created_at && (
            <span className="ml-2">(Updated: {formatDate(post.updated_at)})</span>
          )}
        </div>
        
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        {isAuthenticated && user.id === post.author.id && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link 
              to={`/edit-post/${post.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Edit Post
            </Link>
          </div>
        )}
      </article>
      
      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({post.comments.length})
        </h2>
        
        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Add a comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Write your comment here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {commentLoading ? <LoadingSpinner size="small" /> : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600">
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Login
              </Link> to post a comment.
            </p>
          </div>
        )}
        
        {/* Comments List */}
        {post.comments.length === 0 ? (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">
                    {comment.author.username}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;