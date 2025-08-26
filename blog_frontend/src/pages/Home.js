import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Home component that displays a paginated list of blog posts.
 * 
 * This component fetches and displays blog posts from the API with pagination support.
 * It handles loading states, error messages, and provides navigation between pages.
 * 
 * @component
 * @returns {JSX.Element} The rendered Home component containing:
 *   - A heading for the blog posts section
 *   - Loading spinner during data fetch
 *   - Error message display with dismiss functionality
 *   - List of blog posts rendered as PostCard components
 *   - Pagination controls (Previous/Next buttons) when applicable
 * 
 * @example
 * // Basic usage
 * <Home />
 * 
 * @description
 * Features:
 * - Fetches posts on component mount
 * - Displays loading spinner while fetching data
 * - Shows error messages for failed API calls
 * - Renders posts using PostCard components
 * - Provides pagination when more than 10 posts exist
 * - Handles empty state when no posts are available
 */
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(page);
      setPosts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        current: page
      });
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
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
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      
      <ErrorMessage message={error} onClose={() => setError('')} />
      
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No posts available yet.</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {/* Pagination */}
          {pagination.count > 10 && (
            <div className="flex justify-center space-x-2 mt-8">
              {pagination.previous && (
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Previous
                </button>
              )}
              {pagination.next && (
                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;