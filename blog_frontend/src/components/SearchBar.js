import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SearchBar component that provides a search input with submit functionality.
 * Can either call a provided onSearch callback or navigate to a search results page.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Function} [props.onSearch] - Optional callback function to handle search queries. If not provided, navigates to search page
 * @param {string} [props.placeholder="Search stories..."] - Placeholder text for the search input
 * 
 * @returns {JSX.Element} A form element containing a styled search input and submit button
 * 
 * @example
 * // With callback function
 * <SearchBar onSearch={(query) => handleSearch(query)} placeholder="Search articles..." />
 * 
 * @example
 * // Without callback (uses navigation)
 * <SearchBar placeholder="Find content..." />
 */
const SearchBar = ({ onSearch, placeholder = "Search stories..." }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.75rem 3rem 0.75rem 1rem',
            border: '2px solid var(--gray-200)',
            borderRadius: '12px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--gray-200)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: query.trim() ? 'var(--primary-color)' : 'var(--gray-400)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            width: '2.5rem',
            height: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={!query.trim()}
        >
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;