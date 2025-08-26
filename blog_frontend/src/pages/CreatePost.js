import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostForm from '../components/PostForm';
import SuccessMessage from '../components/SuccessMessage';

/**
 * CreatePost component for creating new blog posts/stories.
 * 
 * This component provides a form interface for users to create and publish new blog posts.
 * It handles form submission, loading states, error handling, and success feedback.
 * Upon successful post creation, it redirects the user to the newly created post.
 * 
 * @component
 * @returns {JSX.Element} The CreatePost page component with form and status messages
 * 
 * @example
 * // Usage in a React Router setup
 * <Route path="/create" element={<CreatePost />} />
 * 
 * @requires useState - React hook for managing component state
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires postsAPI - API service for creating posts
 * @requires PostForm - Child component for the post creation form
 * @requires SuccessMessage - Child component for displaying success notifications
 * 
 * @state {boolean} loading - Indicates if post creation is in progress
 * @state {string} error - Error message to display if post creation fails
 * @state {string} success - Success message to display after successful post creation
 * 
 * @function handleSubmit - Async function that processes form submission and API calls
 * @param {Object} formData - Form data containing post content and metadata
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
      setSuccess('🎉 Story published successfully!');
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
    <div className="main-container fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✍️</div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          Create New Story
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
          Share your thoughts and experiences with the world
        </p>
      </div>
      
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