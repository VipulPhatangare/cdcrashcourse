import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Check for teacher token first (if it's a teacher route)
  if (config.url?.includes('/teacher')) {
    const teacherToken = localStorage.getItem('teacherToken');
    if (teacherToken) {
      config.headers.Authorization = `Bearer ${teacherToken}`;
      return config;
    }
  }

  // Check for admin token
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default api;
