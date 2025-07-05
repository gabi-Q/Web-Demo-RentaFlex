import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-demo-rentaflex-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
