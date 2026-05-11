import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nexhire_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth data if the request actually had a token attached
    // This prevents unauthenticated public page requests from wiping the session
    const hadToken = error.config?.headers?.Authorization;
    if (error.response?.status === 401 && hadToken && typeof window !== 'undefined') {
      localStorage.removeItem('nexhire_token');
      localStorage.removeItem('nexhire_user');
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  googleAuth: (data: any) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

// Jobs API
export const jobsAPI = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  getFeatured: () => api.get('/jobs/featured'),
  getBySlug: (slug: string) => api.get(`/jobs/${slug}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  toggleSave: (id: string) => api.post(`/jobs/${id}/save`),
  getSaved: () => api.get('/jobs/saved'),
};

// Applications API
export const applicationsAPI = {
  apply: (data: any) => api.post('/applications', data),
  getMy: (params?: any) => api.get('/applications/my', { params }),
  getForEmployer: (params?: any) => api.get('/applications/employer', { params }),
  updateStatus: (id: string, data: any) => api.put(`/applications/${id}/status`, data),
};

// Companies API
export const companiesAPI = {
  getAll: (params?: any) => api.get('/companies', { params }),
  getBySlug: (slug: string) => api.get(`/companies/${slug}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  getMy: () => api.get('/companies/my'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Blogs API
export const blogsAPI = {
  getAll: (params?: any) => api.get('/blogs', { params }),
  getAdminAll: (params?: any) => api.get('/blogs/admin', { params }),
  getMy: (params?: any) => api.get('/blogs/my', { params }),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  create: (data: any) => api.post('/blogs', data),
  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};

// AI API
export const aiAPI = {
  analyzeResume: (data: any) => api.post('/ai/analyze-resume', data),
  generateCoverLetter: (data: any) => api.post('/ai/cover-letter', data),
  matchJobs: (data: any) => api.post('/ai/job-match', data),
  interviewChat: (data: any) => api.post('/ai/interview-chat', data),
  getHistory: (params?: any) => api.get('/ai/history', { params }),
  getChatSessions: () => api.get('/ai/chat-sessions'),
  getChatMessages: (sessionId: string) => api.get(`/ai/chat/${sessionId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getJobs: (params?: any) => api.get('/admin/jobs', { params }),
  getContacts: (params?: any) => api.get('/admin/contacts', { params }),
  updateContactStatus: (id: string, status: string) => api.put(`/admin/contacts/${id}`, { status }),
  getEmployerStats: () => api.get('/admin/employer-stats'),
  getSeekerStats: () => api.get('/admin/seeker-stats'),
};

// General API
export const generalAPI = {
  submitContact: (data: any) => api.post('/contact', data),
  subscribeNewsletter: (email: string) => api.post('/newsletter', { email }),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  createReview: (data: any) => api.post('/reviews', data),
  getReviews: (companyId: string) => api.get(`/reviews/${companyId}`),
  getPublicStats: () => api.get('/public-stats'),
  uploadFile: (data: FormData) => api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFile: (url: string) => api.delete('/upload', { data: { url } }),
};
