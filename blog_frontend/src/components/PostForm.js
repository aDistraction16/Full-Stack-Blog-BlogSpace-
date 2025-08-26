import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * A reusable form component for creating and editing blog posts.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} [props.initialData={}] - Initial form data for editing existing posts
 * @param {string} [props.initialData.title] - Initial title value
 * @param {string} [props.initialData.content] - Initial content value
 * @param {Function} props.onSubmit - Callback function called when form is submitted with form data
 * @param {boolean} [props.loading=false] - Loading state that disables the submit button
 * @param {string} [props.error=''] - Error message to display above the form
 * @returns {JSX.Element} A form with title and content fields for blog post creation/editing
 * 
 * @example
 * // Creating a new post
 * <PostForm onSubmit={handleCreatePost} loading={isCreating} error={createError} />
 * 
 * @example
 * // Editing an existing post
 * <PostForm 
 *   initialData={{ title: "My Post", content: "Post content..." }}
 *   onSubmit={handleUpdatePost}
 *   loading={isUpdating}
 *   error={updateError}
 * />
 */
const PostForm = ({ initialData = {}, onSubmit, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="small" /> : 'Save Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;