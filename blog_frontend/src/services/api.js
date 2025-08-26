import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  retry: 3,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    /**
     * Retrieves the access token from browser's local storage.
     * @type {string|null} The access token string if found, null if not present in localStorage
     */
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * API service for managing blog posts
 * @namespace postsAPI
 */

/**
 * Retrieves all posts with pagination
 * @function getAll
 * @param {number} [page=1] - The page number for pagination
 * @returns {Promise} Promise that resolves to the API response containing posts data
 */

/**
 * Retrieves a specific post by its ID
 * @function getById
 * @param {string|number} id - The unique identifier of the post
 * @returns {Promise} Promise that resolves to the API response containing the post data
 */

/**
 * Creates a new blog post
 * @function create
 * @param {Object} data - The post data to be created
 * @param {string} data.title - The title of the post
 * @param {string} data.content - The content/body of the post
 * @returns {Promise} Promise that resolves to the API response containing the created post data
 */

/**
 * Updates an existing blog post
 * @function update
 * @param {string|number} id - The unique identifier of the post to update
 * @param {Object} data - The updated post data
 * @param {string} [data.title] - The updated title of the post
 * @param {string} [data.content] - The updated content/body of the post
 * @returns {Promise} Promise that resolves to the API response containing the updated post data
 */

/**
 * Deletes a blog post by its ID
 * @function delete
 * @param {string|number} id - The unique identifier of the post to delete
 * @returns {Promise} Promise that resolves to the API response confirming deletion
 */

/**
 * Retrieves posts created by the current authenticated user with pagination
 * @function getUserPosts
 * @param {number} [page=1] - The page number for pagination
 * @returns {Promise} Promise that resolves to the API response containing user's posts data
 */
export const postsAPI = {
  getAll: (page = 1) => api.get(`/posts/?page=${page}`),
  getById: (id) => api.get(`/posts/${id}/`),
  create: (data) => api.post('/posts/', data),
  update: (id, data) => api.put(`/posts/${id}/`, data),
  delete: (id) => api.delete(`/posts/${id}/`),
  getUserPosts: (page = 1) => api.get(`/posts/user/?page=${page}`), // Fixed endpoint
};

/**
 * API service for managing comments on blog posts
 * @namespace commentsAPI
 */

/**
 * Retrieves all comments for a specific blog post
 * @function getByPost
 * @param {string|number} postId - The unique identifier of the blog post
 * @returns {Promise} Promise that resolves to the API response containing comments data
 */

/**
 * Creates a new comment for a specific blog post
 * @function create
 * @param {string|number} postId - The unique identifier of the blog post
 * @param {Object} data - The comment data to be created
 * @param {string} data.content - The text content of the comment
 * @param {string} [data.author] - The author of the comment
 * @returns {Promise} Promise that resolves to the API response containing the created comment
 */
export const commentsAPI = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments/`),
  create: (postId, data) => api.post(`/posts/${postId}/comments/`, data),
};

/**
 * API service for search functionality
 * @namespace searchAPI
 */

/**
 * Searches for posts based on a query string with pagination support
 * @function searchPosts
 * @memberof searchAPI
 * @param {string} query - The search query string to find matching posts
 * @param {number} [page=1] - The page number for pagination (defaults to 1)
 * @returns {Promise} Promise that resolves to the API response containing search results
 * @example
 * // Search for posts containing "javascript"
 * searchAPI.searchPosts("javascript", 1)
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 */
export const searchAPI = {
  searchPosts: (query, page = 1) => 
    api.get(`/search/?q=${encodeURIComponent(query)}&page=${page}`),
};

/**
 * API service methods for user-related operations
 * @namespace userAPI
 */

/**
 * Retrieves a user's profile information with optional pagination
 * @function getProfile
 * @param {string} username - The username of the user whose profile to retrieve
 * @param {number} [page=1] - The page number for pagination (defaults to 1)
 * @returns {Promise} Promise that resolves to the user profile data
 */

/**
 * Updates the current user's profile information
 * @function updateProfile
 * @param {Object} data - The profile data to update
 * @returns {Promise} Promise that resolves to the updated profile data
 */
export const userAPI = {
  getProfile: (username, page = 1) => 
    api.get(`/users/${username}/?page=${page}`),
  updateProfile: (data) => 
    api.put('/profile/update/', data),
};

/**
 * Authentication API service object containing methods for user authentication operations.
 * @namespace authAPI
 * @description Provides methods to handle user login, registration, and logout operations
 * through API endpoints.
 */

/**
 * Authenticates a user with the provided credentials.
 * @function login
 * @memberof authAPI
 * @param {Object} credentials - The user login credentials
 * @param {string} credentials.username - The username or email
 * @param {string} credentials.password - The user password
 * @returns {Promise} Promise that resolves to the authentication response
 * @example
 * authAPI.login({ username: 'user@example.com', password: 'password123' })
 */

/**
 * Registers a new user with the provided user data.
 * @function register
 * @memberof authAPI
 * @param {Object} userData - The user registration data
 * @param {string} userData.username - The desired username
 * @param {string} userData.email - The user email address
 * @param {string} userData.password - The user password
 * @returns {Promise} Promise that resolves to the registration response
 * @example
 * authAPI.register({ username: 'newuser', email: 'user@example.com', password: 'password123' })
 */

/**
 * Logs out the current authenticated user.
 * @function logout
 * @memberof authAPI
 * @returns {Promise} Promise that resolves to the logout response
 * @example
 * authAPI.logout()
 */
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
};

export default api;