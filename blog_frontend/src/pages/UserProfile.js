import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * UserProfile Component - Displays a user's profile page with their information and published stories
 * 
 * This component renders a comprehensive user profile page that shows user details, statistics,
 * and their published blog posts. It supports profile editing for the authenticated user viewing
 * their own profile and provides navigation back to the main stories feed.
 * 
 * @component
 * @returns {JSX.Element} The rendered user profile page
 * 
 * @description
 * Features:
 * - Displays user avatar, username, join date, and post count statistics
 * - Shows all stories/posts published by the user with pagination support
 * - Allows profile editing (email) for authenticated users viewing their own profile
 * - Responsive design with loading states and error handling
 * - Navigation breadcrumbs and success/error messaging
 * 
 * @example
 * // Route usage in App.js
 * <Route path="/profile/:username" element={<UserProfile />} />
 * 
 * @requires useParams - For extracting username from URL parameters
 * @requires useAuth - For getting current authenticated user context
 * @requires userAPI - API service for user profile operations (getProfile, updateProfile)
 * @requires LoadingSpinner - Loading indicator component
 * @requires ErrorMessage - Error display component  
 * @requires SuccessMessage - Success notification component
 * @requires PostCard - Component for rendering individual blog posts
 * 
 * @state {Object|null} profileData - Contains user info and their posts
 * @state {boolean} loading - Loading state for initial profile fetch
 * @state {string} error - Error message for display
 * @state {boolean} editMode - Toggle for profile edit form
 * @state {Object} formData - Form data for profile updates (email)
 * @state {boolean} updateLoading - Loading state for profile updates
 * @state {string} success - Success message for profile updates
 * 
 * @param {string} username - URL parameter for the profile username to display
 * 
 * @throws {Error} 404 - When user profile is not found
 * @throws {Error} Network errors during profile fetch or update operations
 */
const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser && currentUser.username === username;

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile(username);
      setProfileData(response.data);
      if (isOwnProfile) {
        setFormData({ email: response.data.user.email || '' });
      }
    } catch (err) {
      setError(err.response?.status === 404 ? 'User not found' : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');

    try {
      await userAPI.updateProfile(formData);
      setSuccess('✨ Profile updated successfully!');
      setEditMode(false);
      fetchUserProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center" style={{ paddingTop: '4rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="main-container">
        <div className="card text-center">
          <div style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>
              Profile Not Found
            </h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
              The user you're looking for doesn't exist.
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
      {/* Back Button */}
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
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      {/* Profile Header */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {profileData.user.username.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--gray-800)',
              marginBottom: '0.5rem'
            }}>
              {profileData.user.username}
            </h1>
            <p style={{ 
              color: 'var(--gray-600)',
              fontSize: '1.1rem',
              marginBottom: '1rem'
            }}>
              Member since {formatDate(profileData.user.date_joined)}
            </p>

            {/* Stats */}
            <div style={{ 
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--primary-color)'
                }}>
                  {profileData.user.posts_count}
                </div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Stories Published
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-primary"
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Edit Form */}
        {editMode && isOwnProfile && (
          <form onSubmit={handleUpdateProfile} style={{ 
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--gray-200)'
          }}>
            <div className="form-group">
              <label className="form-label">📧 Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={updateLoading}
                className="btn btn-primary"
              >
                {updateLoading ? <LoadingSpinner size="small" /> : '💾 Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User's Posts */}
      <div>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          📚 {isOwnProfile ? 'Your' : `${profileData.user.username}'s`} Stories ({profileData.posts.count})
        </h2>

        {profileData.posts.results.length === 0 ? (
          <div className="card text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ 
                marginBottom: '1rem', 
                color: 'var(--gray-700)',
                fontSize: '1.5rem'
              }}>
                No stories yet
              </h3>
              <p style={{ 
                color: 'var(--gray-600)', 
                marginBottom: '2rem',
                fontSize: '1.1rem'
              }}>
                {isOwnProfile 
                  ? "You haven't published any stories yet. Start writing today!"
                  : `${profileData.user.username} hasn't published any stories yet.`
                }
              </p>
              {isOwnProfile && (
                <Link to="/create-post" className="btn btn-primary">
                  ✍️ Write Your First Story
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="scroll-reveal active">
            {profileData.posts.results.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;