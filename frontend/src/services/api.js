import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-api-8wdh.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const resumes = {
  upload: (formData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/resumes'),
};

export const analysis = {
  run: (resumeId, jobDescription, domain) => api.post('/analysis/run', { resumeId, jobDescription, domain }),
  getHistory: () => api.get('/analysis/history'),
  getReport: (id) => api.get(`/analysis/report/${id}`),
};

export default api;
