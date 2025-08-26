import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';

/**
 * Search component for searching and displaying blog posts.
 * 
 * This component provides a search interface that allows users to search for blog posts
 * using keywords. It manages search state, displays results with pagination, and handles
 * loading and error states. The search query is managed through URL search parameters.
 * 
 * @component
 * @returns {JSX.Element} The rendered search page component
 * 
 * @description
 * Features:
 * - Real-time search functionality with URL parameter management
 * - Paginated search results display
 * - Loading states and error handling
 * - Empty state handling for no results
 * - Smooth scrolling on page changes
 * - Responsive design with glassmorphism styling
 * 
 * @example
 * // Usage in a route
 * <Route path="/search" element={<Search />} />
 * 
 * @requires useSearchParams - React Router hook for URL search parameters
 * @requires useState - React hook for component state management
 * @requires useEffect - React hook for side effects
 * @requires searchAPI - API service for performing search requests
 * @requires SearchBar - Component for search input
 * @requires PostCard - Component for displaying individual posts
 * @requires ErrorMessage - Component for displaying error messages
 * @requires LoadingSpinner - Component for loading indication
 */
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery, page = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await searchAPI.searchPosts(searchQuery, page);
      setResults(response.data.results);
      setPagination({
        count: response.data.count,
        totalPages: response.data.total_pages,
        currentPage: response.data.current_page,
        hasNext: response.data.has_next,
        hasPrevious: response.data.has_previous
      });
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const handlePageChange = (page) => {
    performSearch(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="main-container fade-in">
      {/* Search Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '3rem 2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: 'white',
          marginBottom: '1rem'
        }}>
          Search Stories
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
          Discover amazing content from our community
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Search Results */}
      {query && (
        <div>
          <div style={{ 
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 style={{ 
              margin: 0,
              color: 'var(--gray-800)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📖 Search Results for "{query}"
              {pagination.count !== undefined && (
                <span style={{ 
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  color: 'var(--gray-600)'
                }}>
                  ({pagination.count} result{pagination.count !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />

          {loading ? (
            <div className="text-center" style={{ paddingTop: '3rem' }}>
              <LoadingSpinner size="large" />
              <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                Searching for stories...
              </p>
            </div>
          ) : results.length === 0 && query ? (
            <div className="card text-center">
              <div style={{ padding: '4rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕵️</div>
                <h3 style={{ 
                  marginBottom: '1rem', 
                  color: 'var(--gray-700)',
                  fontSize: '1.5rem'
                }}>
                  No stories found
                </h3>
                <p style={{ 
                  color: 'var(--gray-600)', 
                  marginBottom: '2rem',
                  fontSize: '1.1rem'
                }}>
                  Try searching with different keywords or browse all stories.
                </p>
                <Link to="/" className="btn btn-primary">
                  🏠 Browse All Stories
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="scroll-reveal active">
                {results.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  {pagination.hasPrevious && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                  )}
                  <span className="pagination-btn" style={{ 
                    background: 'var(--primary-color)', 
                    color: 'white',
                    border: '2px solid var(--primary-color)'
                  }}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  {pagination.hasNext && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* No query state */}
      {!query && (
        <div className="card text-center">
          <div style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--gray-700)',
              fontSize: '1.5rem'
            }}>
              Start searching
            </h3>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: '1.1rem'
            }}>
              Enter keywords above to find stories that interest you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;