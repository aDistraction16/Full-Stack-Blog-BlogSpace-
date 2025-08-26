import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * EditPost component for editing existing blog posts
 * 
 * This component allows authenticated users to edit their own blog posts.
 * It fetches the post data, validates ownership, and provides a form interface
 * for updating the post content.
 * 
 * @component
 * @description A React component that renders an edit form for blog posts with
 * authorization checks to ensure users can only edit their own stories.
 * 
 * @requires useParams - React Router hook to get the post ID from URL parameters
 * @requires useAuth - Custom hook to get the current authenticated user
 * @requires useNavigate - React Router hook for programmatic navigation
 * @requires postsAPI - API service for post-related operations
 * 
 * @features
 * - Fetches post data by ID on component mount
 * - Validates post ownership (users can only edit their own posts)
 * - Displays loading states during fetch and submit operations
 * - Shows success/error messages for user feedback
 * - Redirects to post detail page after successful update
 * - Provides navigation back to the original post
 * 
 * @state {Object|null} post - The post data being edited
 * @state {boolean} loading - Loading state for initial post fetch
 * @state {boolean} submitLoading - Loading state for form submission
 * @state {string} error - Error message to display to user
 * @state {string} success - Success message to display to user
 * 
 * @returns {JSX.Element} The rendered edit post page with form interface
 * 
 * @example
 * // Route definition in App.js
 * <Route path="/posts/:id/edit" element={<EditPost />} />
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
      
      if (response.data.author.id !== user.id) {
        setError('❌ You can only edit your own stories.');
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
      setSuccess('🎉 Story updated successfully!');
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
      <div className="main-container">
        <div className="text-center" style={{ paddingTop: '4rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Loading story for editing...
          </p>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="main-container">
        <div className="card text-center">
          <div style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <ErrorMessage message={error} />
            <Link to="/dashboard" className="btn btn-primary">
              📊 Back to Dashboard
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
          to={`/posts/${id}`} 
          className="btn btn-secondary"
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          ← Back to Story
        </Link>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✏️</div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          Edit Your Story
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
          Perfect your masterpiece
        </p>
      </div>
      
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