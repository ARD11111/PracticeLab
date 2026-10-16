import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Interceptor to attach Auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('practicelab_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const problemAPI = {
  getProblems: (params) => API.get('/problems', { params }),
  getProblemById: (id) => API.get(`/problems/${id}`),
  createProblem: (data) => API.post('/problems', data)
};

export const patternAPI = {
  getPatterns: () => API.get('/patterns'),
  getPatternById: (id) => API.get(`/patterns/${id}`)
};

export const practiceAPI = {
  createSession: (sessionData) => API.post('/practice/session', sessionData),
  getHistory: () => API.get('/practice/history')
};

export const reviewAPI = {
  getReviewQueue: () => API.get('/reviews/queue'),
  toggleArchive: (problemId) => API.patch(`/reviews/archive/${problemId}`)
};

export const recommendationAPI = {
  getRecommendations: () => API.get('/recommendations')
};

export const analyticsAPI = {
  getAnalytics: () => API.get('/analytics')
};

export const extensionAPI = {
  detectProblem: (data) => API.post('/extension/detect', data),
  addOrGet: (data) => API.post('/extension/add-or-get', data)
};

export const userAPI = {
  getSettings: () => API.get('/users/settings'),
  updateSettings: (data) => API.put('/users/settings', data)
};

export const notificationAPI = {
  sendTestEmail: () => API.post('/notifications/test-email')
};

export default API;
