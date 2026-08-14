// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('signal_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('signal_token');
      localStorage.removeItem('signal_user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth APIs ---
export const authAPI = {
  requestOTP: (phone_number) => api.post('/auth/request-otp', { phone_number }),
  verifyOTP: (phone_number, otp) => api.post('/auth/verify-otp', { phone_number, otp }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// --- User & Contact APIs ---
export const userAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getContacts: () => api.get('/users/contacts'),
  addContact: (contact_id) => api.post('/users/contacts', { contact_id }),
  updateProfile: (data) => api.put('/users/profile', data),
};

// --- Conversation APIs ---
export const conversationAPI = {
  getConversations: () => api.get('/conversations'),
  createDirectConversation: (other_user_id) => api.post('/conversations/direct', { other_user_id }),
  createGroupConversation: (name, member_ids) => api.post('/conversations/group', { name, member_ids }),
  getMessages: (conversation_id) => api.get(`/conversations/${conversation_id}/messages`),
  getParticipants: (conversation_id) => api.get(`/conversations/${conversation_id}/participants`),
  addGroupMember: (conversation_id, user_id) => api.post(`/conversations/${conversation_id}/participants`, { user_id }),
  removeGroupMember: (conversation_id, user_id) => api.delete(`/conversations/${conversation_id}/participants/${user_id}`),
};

export default api;