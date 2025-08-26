import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * EditPost component for editing existing blog posts.
 * 
 * This component handles the editing functionality for blog posts, including:
 * - Fetching the existing post data by ID
 * - Verifying user ownership of the post
 * - Providing a form interface for editing
 * - Handling post updates and navigation
 * 
 * @component
 * @returns {JSX.Element} The EditPost component rendering either a loading state,
 *                        error message, or the edit post form
 * 
 * @requires useParams - React Router hook to get the post ID from URL parameters
 * @requires useAuth - Custom hook to get the current authenticated user
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires postsAPI - API service for post-related operations
 * 
 * @example
 * // Usage in React Router
 * <Route path="/posts/:id/edit" element={<EditPost />} />
 * 
 * @states
 * @property {Object|null} post - The post data being edited
 * @property {boolean} loading - Loading state for initial post fetch
 * @property {boolean} submitLoading - Loading state for form submission
 * @property {string} error - Error message to display
 * @property {string} success - Success message to display
 * 
 * @security
 * - Verifies user ownership before allowing edits
 * - Redirects unauthorized users with error message
 */
const EditPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      
      // Check if user owns this post
      if (response.data.author.id !== user.id) {
        setError('You can only edit your own posts.');
        return;
      }
      
      setPost(response.data);
    } catch (err) {
      setError('Failed to fetch post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await postsAPI.update(id, formData);
      setSuccess('Post updated successfully!');
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update post. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to={`/posts/${id}`} className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
        ← Back to Post
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      
      <SuccessMessage message={success} />
      
      <PostForm 
        initialData={post}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={error}
      />
    </div>
  );
};

export default EditPost;