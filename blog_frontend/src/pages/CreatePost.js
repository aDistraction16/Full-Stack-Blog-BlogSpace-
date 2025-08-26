import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostForm from '../components/PostForm';
import SuccessMessage from '../components/SuccessMessage';

/**
 * CreatePost component for creating new blog posts
 * 
 * This component provides a form interface for users to create new blog posts.
 * It handles form submission, loading states, error handling, and success feedback.
 * Upon successful post creation, it redirects the user to the newly created post.
 * 
 * @component
 * @returns {JSX.Element} A page layout containing a post creation form with:
 *   - Page title "Create New Post"
 *   - Success message display
 *   - PostForm component with submit handling
 * 
 * @example
 * // Usage in a React Router setup
 * <Route path="/create" element={<CreatePost />} />
 * 
 * @requires useState - React hook for managing component state
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires postsAPI - API service for creating posts
 * @requires SuccessMessage - Component for displaying success notifications
 * @requires PostForm - Form component for post creation
 */
const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await postsAPI.create(formData);
      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      <SuccessMessage message={success} />
      
      <PostForm 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default CreatePost;