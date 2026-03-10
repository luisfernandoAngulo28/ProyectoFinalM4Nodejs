import axios from 'axios';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  createBulk: async (usersArray) => {
    const response = await api.post('/users/bulk', { users: usersArray });
    return response.data;
  },
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  patch: async (id, userData) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getPaginated: async (params) => {
    const response = await api.get('/users/list/pagination', { params });
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  getByUserId: async (userId) => {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getGeneralStats: async () => {
    const response = await api.get('/reports/general');
    return response.data;
  },
  getTopUsers: async (limit = 10) => {
    const response = await api.get(`/reports/top-users?limit=${limit}`);
    return response.data;
  },
  getTasksStats: async () => {
    const response = await api.get('/reports/tasks-stats');
    return response.data;
  },
  getUserProgress: async () => {
    const response = await api.get('/reports/user-progress');
    return response.data;
  },
  getTrends: async () => {
    const response = await api.get('/reports/trends');
    return response.data;
  },
  getInactiveUsers: async () => {
    const response = await api.get('/reports/inactive-users');
    return response.data;
  },
  getUsersComparison: async () => {
    const response = await api.get('/reports/users-comparison');
    return response.data;
  },
};

export default api;
