import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * Dashboard component for authenticated users to manage their blog posts.
 * 
 * Displays a personalized dashboard where users can view, edit, and delete their own posts.
 * Includes functionality to create new posts and provides real-time feedback for user actions.
 * 
 * @component
 * @returns {JSX.Element} The dashboard page with user's posts and management controls
 * 
 * @description
 * Features:
 * - Displays welcome message with username
 * - Shows count of user's posts
 * - Lists all posts created by the authenticated user
 * - Provides edit and delete functionality for each post
 * - Quick access to create new posts
 * - Loading states for better UX
 * - Success/error message handling
 * - Confirmation dialog for post deletion
 * 
 * @requires useAuth - Authentication context hook for user data
 * @requires useNavigate - React Router hook for navigation
 * @requires postsAPI - API service for post operations
 * @requires PostCard - Component for displaying individual posts
 * @requires LoadingSpinner - Loading indicator component
 * @requires ErrorMessage - Error display component
 * @requires SuccessMessage - Success notification component
 * 
 * @example
 * // Used in protected routes for authenticated users
 * <Dashboard />
 */
const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getUserPosts();
      setPosts(response.data.results || response.data);
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
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleteLoading(post.id);
    try {
      await postsAPI.delete(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
      setSuccess('Post deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
        <Link 
          to="/create-post"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Post
        </Link>
      </div>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      
      <h2 className="text-2xl font-semibold mb-6">Your Posts ({posts.length})</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
          <Link 
            to="/create-post"
            className="text-blue-500 hover:text-blue-700"
          >
            Create your first post →
          </Link>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="relative">
            {deleteLoading === post.id && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <LoadingSpinner />
              </div>
            )}
            <PostCard 
              post={post}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;