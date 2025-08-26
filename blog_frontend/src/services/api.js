import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

//Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    /**
     * Retrieves the JWT access token from browser's localStorage.
     * This token is typically used for authenticating API requests to protected endpoints.
     * 
     * @type {string|null} The stored access token string, or null if no token exists
     */
    (config) => {
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

api.interceptors.response.use(
    /**
     * Refreshes the authentication token using the provided refresh token.
     * Makes a POST request to the token refresh endpoint with the refresh token
     * to obtain a new access token for continued API authentication.
     * 
     * @async
     * @function
     * @param {string} refreshToken - The refresh token used to obtain a new access token
     * @returns {Promise<AxiosResponse>} Promise that resolves to the axios response containing the new access token
     * @throws {Error} Throws an error if the token refresh request fails
     */
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration or unauthorized access
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    
                    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    // Retry the original request with the new access token
                    error.config.headers.Authorization = `Bearer ${response.data.access}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Authentication API service object containing methods for user authentication operations.
 * Provides endpoints for user registration and login functionality.
 * 
 * @namespace authAPI
 */

/**
 * Registers a new user account with the provided user data.
 * 
 * @function register
 * @memberof authAPI
 * @param {Object} userData - The user registration data
 * @param {string} userData.username - The desired username
 * @param {string} userData.email - The user's email address
 * @param {string} userData.password - The user's password
 * @returns {Promise} Promise that resolves to the API response containing registration result
 */

/**
 * Authenticates a user with the provided login credentials.
 * 
 * @function login
 * @memberof authAPI
 * @param {Object} credentials - The user login credentials
 * @param {string} credentials.username - The username or email
 * @param {string} credentials.password - The user's password
 * @returns {Promise} Promise that resolves to the API response containing authentication token and user data
 */
export const authAPI = {
    register: (userData) => api.post('/auth/register/', userData),
    login: (credentials) => api.post('/auth/login/', credentials),
};

/**
 * API service object for managing blog posts operations.
 * Provides methods for CRUD operations and user-specific post retrieval.
 * 
 * @namespace postsAPI
 * @property {Function} getAll - Retrieves all posts with optional pagination
 * @property {Function} getById - Retrieves a specific post by ID
 * @property {Function} create - Creates a new post
 * @property {Function} update - Updates an existing post
 * @property {Function} delete - Deletes a post by ID
 * @property {Function} getUserPosts - Retrieves posts belonging to the current user
 */

/**
 * Retrieves all posts with pagination support.
 * @param {number} [page=1] - The page number for pagination
 * @returns {Promise} API response containing posts data
 */

/**
 * Retrieves a specific post by its ID.
 * @param {string|number} id - The unique identifier of the post
 * @returns {Promise} API response containing the post data
 */

/**
 * Creates a new blog post.
 * @param {Object} postData - The post data object
 * @param {string} postData.title - The title of the post
 * @param {string} postData.content - The content of the post
 * @param {string} [postData.excerpt] - Optional excerpt of the post
 * @returns {Promise} API response containing the created post data
 */

/**
 * Updates an existing blog post.
 * @param {string|number} id - The unique identifier of the post to update
 * @param {Object} postData - The updated post data object
 * @param {string} [postData.title] - The updated title of the post
 * @param {string} [postData.content] - The updated content of the post
 * @param {string} [postData.excerpt] - The updated excerpt of the post
 * @returns {Promise} API response containing the updated post data
 */

/**
 * Deletes a blog post by its ID.
 * @param {string|number} id - The unique identifier of the post to delete
 * @returns {Promise} API response confirming deletion
 */

/**
 * Retrieves posts belonging to the current authenticated user.
 * @param {number} [page=1] - The page number for pagination
 * @returns {Promise} API response containing user's posts data
 */
export const postsAPI = {
    getAll: (page = 1) => api.get(`/posts/?page=${page}`),
    getById: (id) => api.get(`/posts/${id}/`),
    create: (postData) => api.post('/posts/', postData),
    update: (id, postData) => api.put(`/posts/${id}/`, postData),
    delete: (id) => api.delete(`/posts/${id}/`),
    getUserPosts: (page = 1) => api.get(`/my-posts/?page=${page}`),
};

/**
 * API service for managing comments
 * @namespace commentsAPI
 */

/**
 * Creates a new comment for a specific post
 * @function create
 * @memberof commentsAPI
 * @param {string|number} postId - The unique identifier of the post to comment on
 * @param {Object} commentData - The comment data to be submitted
 * @param {string} commentData.content - The text content of the comment
 * @param {string} [commentData.author] - The author of the comment
 * @returns {Promise<Object>} A promise that resolves to the created comment object
 * @throws {Error} Throws an error if the API request fails
 */
export const commentsAPI = {
    create: (postId, commentData) => api.post(`/posts/${postId}/comments/`, commentData),
}

export default api;