import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * PostForm component for creating and editing blog posts
 * 
 * A comprehensive form component that handles both creation and editing of blog posts.
 * Features include real-time character counting, validation, loading states, and 
 * helpful writing tips for users.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} [props.initialData={}] - Initial form data for editing existing posts
 * @param {string} [props.initialData.title] - Initial title value
 * @param {string} [props.initialData.content] - Initial content value
 * @param {Function} props.onSubmit - Callback function called when form is submitted
 * @param {Object} props.onSubmit.formData - Form data object containing title and content
 * @param {string} props.onSubmit.formData.title - The post title
 * @param {string} props.onSubmit.formData.content - The post content
 * @param {boolean} [props.loading=false] - Whether the form is in a loading state
 * @param {string} [props.error=''] - Error message to display
 * 
 * @returns {JSX.Element} The rendered PostForm component
 * 
 * @example
 * // Creating a new post
 * <PostForm 
 *   onSubmit={(data) => createPost(data)}
 *   loading={isCreating}
 *   error={createError}
 * />
 * 
 * @example
 * // Editing existing post
 * <PostForm 
 *   initialData={{ title: "My Post", content: "Post content..." }}
 *   onSubmit={(data) => updatePost(postId, data)}
 *   loading={isUpdating}
 *   error={updateError}
 * />
 */
const PostForm = ({ initialData = {}, onSubmit, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || ''
  });
  const [charCount, setCharCount] = useState(initialData.content?.length || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'content') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData.title;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <label className="form-label">Story Title</label>
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Give your story an engaging title..."
            required
            style={{ fontSize: '1.1rem', fontWeight: '500' }}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.5rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📖</span>
              <label className="form-label">Your Story</label>
            </div>
            <span style={{ 
              fontSize: '0.875rem', 
              color: charCount > 2000 ? 'var(--error-color)' : 'var(--gray-500)',
              fontWeight: '500'
            }}>
              {charCount.toLocaleString()} characters
            </span>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className="form-textarea"
            placeholder="Tell your story... Share your thoughts, experiences, and insights with the community."
            required
            style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7',
              resize: 'vertical',
              minHeight: '300px'
            }}
          />
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.875rem', 
            color: 'var(--gray-500)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💡</span>
            <span>Tip: Use line breaks to make your story more readable</span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            className="btn btn-primary"
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              isEditing ? '💾 Update Story' : '🚀 Publish Story'
            )}
          </button>
        </div>
      </form>
      
      {/* Writing Tips */}
      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' }}>
        <h3 style={{ 
          color: 'var(--primary-color)', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💡 Writing Tips
        </h3>
        <ul style={{ 
          color: 'var(--gray-700)', 
          lineHeight: '1.6',
          paddingLeft: '1.5rem' 
        }}>
          <li>Start with an engaging hook to capture readers' attention</li>
          <li>Use clear, concise language and break up long paragraphs</li>
          <li>Include personal experiences or examples to make it relatable</li>
          <li>End with a thought-provoking conclusion or call to action</li>
        </ul>
      </div>
    </div>
  );
};

export default PostForm;