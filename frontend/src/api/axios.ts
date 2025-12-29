// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ Backend NestJS
});

// Interceptor: ดักจับทุก Request เพื่อยัด Token ใส่ Header ให้เอง
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;