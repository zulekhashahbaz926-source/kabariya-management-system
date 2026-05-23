// API client services connecting to the Express Node.js Server

const API_BASE_URL = '/api';

// Helper to construct headers with JWT token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('learnhub_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Response helper
const handleResponse = async (response) => {
  let data = {};
  const text = await response.text();
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
  }

  if (!response.ok) {
    // If backend is down, Vite proxy yields 504 Gateway Timeout or similar html
    const friendlyMessage = (response.status === 504 || response.status === 502 || response.status === 404)
      ? 'Backend API server is unreachable. Please verify you started the backend server in a separate terminal using: npm.cmd start'
      : (data.message || 'API request failed');

    const error = new Error(friendlyMessage);
    error.status = response.status;
    error.errorType = data.errorType || 'CONNECTION_FAILURE';
    throw error;
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    signup: async (username, email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, email, password })
      });
      return handleResponse(response);
    },
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },

  // Courses Store & Student Catalog
  courses: {
    getAll: async (category = '', search = '') => {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const response = await fetch(`${API_BASE_URL}/courses?${queryParams.toString()}`);
      return handleResponse(response);
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`);
      return handleResponse(response);
    },
    purchase: async (courseId, cardNumber, couponCode) => {
      const response = await fetch(`${API_BASE_URL}/courses/purchase`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ courseId, cardNumber, couponCode })
      });
      return handleResponse(response);
    },
    toggleBookmark: async (courseId) => {
      const response = await fetch(`${API_BASE_URL}/courses/bookmarks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ courseId })
      });
      return handleResponse(response);
    },
    getBookmarks: async () => {
      const response = await fetch(`${API_BASE_URL}/courses/bookmarks`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    submitReview: async (courseId, rating, reviewText) => {
      const response = await fetch(`${API_BASE_URL}/courses/review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ courseId, rating, reviewText })
      });
      return handleResponse(response);
    },
    updateProgress: async (courseId, chapterId) => {
      const response = await fetch(`${API_BASE_URL}/courses/progress`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ courseId, chapterId })
      });
      return handleResponse(response);
    },
    getDashboard: async () => {
      const response = await fetch(`${API_BASE_URL}/courses/dashboard`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },

  // AI Cognitive features
  ai: {
    sendChatMessage: async (message) => {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message })
      });
      return handleResponse(response);
    },
    getChatHistory: async () => {
      const response = await fetch(`${API_BASE_URL}/ai/chat/history`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    generateQuiz: async (topic, courseId = null) => {
      const response = await fetch(`${API_BASE_URL}/ai/quiz`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topic, courseId })
      });
      return handleResponse(response);
    },
    summarize: async (content) => {
      const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content })
      });
      return handleResponse(response);
    }
  }
};
