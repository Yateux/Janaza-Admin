import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-storage');
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
