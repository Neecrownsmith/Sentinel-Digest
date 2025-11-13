import axios from 'axios';
import logger from '../utils/logger';
import { getApiConfig } from '../utils/env';

// Get API configuration with fallback
const { apiUrl } = getApiConfig();
const API_BASE_URL = apiUrl;

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log API errors
    logger.apiError(error, {
      url: originalRequest?.url,
      method: originalRequest?.method
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        logger.error('Token refresh failed', { error: refreshError.message });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Articles API
export const articlesAPI = {
  // Get all articles with filters and pagination
  getArticles: (params = {}) => api.get('/articles/', { params }),
  
  // Get single article by slug
  getArticle: (slug) => api.get(`/articles/${slug}/`),
  
  // Get top stories (editorially curated)
  getTopStories: () => api.get('/articles/top-stories/'),
  
  // Get most read articles
  getMostRead: (params = {}) => api.get('/articles/most-read/', { params }),
  
  // Get trending articles
  getTrending: (params = {}) => api.get('/articles/trending/', { params }),
  
  // Get related articles
  getRelated: (articleId, limit = 5) => 
    api.get('/articles/related/', { params: { article_id: articleId, limit } }),
  
  // Get articles by category
  getByCategory: (categorySlug, page = 1) => 
    api.get('/articles/', { params: { category: categorySlug, page } }),
  
  // Get articles by tag
  getByTag: (tagSlug, page = 1) => 
    api.get('/articles/', { params: { tag: tagSlug, page } }),
  
  // Search articles
  search: (query, page = 1) => 
    api.get('/articles/', { params: { search: query, page } }),
  
  // Like/Unlike article
  likeArticle: (slug) => api.post(`/articles/${slug}/like/`),
  
  // Bookmark/Unbookmark article
  bookmarkArticle: (slug) => api.post(`/articles/${slug}/bookmark/`),
  
  // Get user's bookmarked articles
  getMyBookmarks: () => api.get('/articles/my_bookmarks/'),
  
  // Get user's liked articles
  getMyLiked: () => api.get('/articles/my_liked/'),
  
  // Add comment
  addComment: (slug, commentData) => api.post(`/articles/${slug}/add_comment/`, commentData),
  
  // Delete comment
  deleteComment: (slug, commentId) => api.delete(`/articles/${slug}/comments/${commentId}/`),
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: () => api.get('/categories/'),
  
  // Get single category by slug
  getCategory: (slug) => api.get(`/categories/${slug}/`),
};

// Tags API
export const tagsAPI = {
  // Get all tags
  getTags: () => api.get('/tags/'),
  
  // Get popular tags
  getPopular: (limit = 20) => api.get('/tags/popular/', { params: { limit } }),
  
  // Get single tag by slug
  getTag: (slug) => api.get(`/tags/${slug}/`),
};

// Search API
export const searchAPI = {
  // Unified search
  search: (query, type = 'articles') => 
    api.get('/search/', { params: { q: query, type } }),
};

// Auth API
export const authAPI = {
  // Register new user
  register: (username, email, password, passwordConfirm) => 
    api.post('/user/register/', { 
      username, 
      email, 
      password, 
      password_confirm: passwordConfirm 
    }).then(res => res.data),
  
  // Login
  login: (email, password) => 
    api.post('/token/', { email, password }).then(res => res.data),
  
  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  // Get user profile
  getProfile: () => api.get('/user/profile/').then(res => res.data),
  
  // Update user profile
  updateProfile: (userData) => api.put('/user/profile/update/', userData).then(res => res.data),
  
  // Refresh token
  refreshToken: (refreshToken) => 
    api.post('/token/refresh/', { refresh: refreshToken }).then(res => res.data),
};

// Social Media Posts API
export const socialPostsAPI = {
  // Get pending social posts
  getPendingPosts: () => api.get('/social-posts/pending/').then(res => res.data),
  
  // Mark post as posted
  markAsPosted: (postId) => api.post(`/social-posts/${postId}/mark-posted/`).then(res => res.data),
};

// Jobs/Opportunities API
export const jobsAPI = {
  // Get all jobs with filters and pagination
  getJobs: (params = {}) => api.get('/jobs/', { params }),
  
  // Get single job by slug
  getJob: (slug) => api.get(`/jobs/${slug}/`),
  
  // Get featured jobs (6 most recent)
  getFeatured: () => api.get('/jobs/featured/'),
  
  // Get jobs by category
  getByCategory: (categorySlug, page = 1) => 
    api.get('/jobs/', { params: { category: categorySlug, page } }),
  
  // Search jobs
  search: (query, params = {}) => 
    api.get('/jobs/search/', { params: { q: query, ...params } }),
};

// Job Categories API
export const jobCategoriesAPI = {
  // Get all job categories
  getCategories: () => api.get('/job-categories/'),
  
  // Get single job category by slug
  getCategory: (slug) => api.get(`/job-categories/${slug}/`),
};

export default api;
