import axios from 'axios';
import { login, logout, getUserInfo, isAuthenticated } from './authApi';

export { login, logout, getUserInfo, isAuthenticated };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
});

api.interceptors.request.use(
  (config) => {
    // Check if we're in a browser environment before accessing localStorage
    const isBrowser = typeof window !== 'undefined';
    const token = isBrowser ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

