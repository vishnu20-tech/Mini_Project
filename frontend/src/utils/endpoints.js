import api from './api.js';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserById: (userId) => api.get(`/users/${userId}`),
  searchUsers: (q, limit = 20) => api.get('/users/search', { params: { q, limit } }),
  getAllUsers: () => api.get('/users/all'),
};

export const friendAPI = {
  sendRequest: (receiverId) => api.post('/friends/request/send', { receiverId }),
  getPendingRequests: () => api.get('/friends/requests/pending'),
  getSentRequests: () => api.get('/friends/requests/sent'),
  acceptRequest: (requestId) => api.post('/friends/request/accept', { requestId }),
  rejectRequest: (requestId) => api.post('/friends/request/reject', { requestId }),
  cancelRequest: (requestId) => api.post('/friends/request/cancel', { requestId }),
  removeFriend: (friendId) => api.post('/friends/remove', { friendId }),
  getFriends: () => api.get('/friends/list'),
};

export const recommendationAPI = {
  getRecommendations: (limit = 10) => api.get('/recommendations', { params: { limit } }),
  getMutualFriends: (userId) => api.get(`/recommendations/mutual/${userId}`),
};
