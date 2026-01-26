import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only clear token if it's an auth error, not on login attempts
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        if (window.location.pathname.startsWith('/admin') && 
            !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const skillsService = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  reorder: (items) => api.put('/skills/reorder/batch', { items }),
};

export const projectsService = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/projects/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const experienceService = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const socialService = {
  getAll: () => api.get('/social'),
  create: (data) => api.post('/social', data),
  update: (id, data) => api.put(`/social/${id}`, data),
  delete: (id) => api.delete(`/social/${id}`),
};

export const messagesService = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/messages'),
  getUnreadCount: () => api.get('/messages/unread/count'),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default api;
