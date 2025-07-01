import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-alert-5ea310f83e0b.herokuapp.com/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
});

// Types
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  type: string;
  exp: number;
}


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getLocalStorageItem('refresh_token');
        if (!refreshToken) {
         
          logout();
          return Promise.reject(error);
        }

       
        const refreshConfig = {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        };
        
        
        const response = await axios.get(`${API_BASE_URL}/auth/refresh`, refreshConfig);
        
        if (response.data) {
          const { accessToken, refreshToken } = response.data;
        
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
         
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          
        
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
      
        console.error('Error refreshing token:', refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);


// Helper functions for localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const login = async ({ email, password }: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Login attempt with:', email);
    const response = await axiosInstance.post('/auth/login', { email, password });
    const data = response.data;
    console.log('Login response:', data);
    
    if (data.accessToken) {
      setLocalStorageItem('access_token', data.accessToken);
    }
    
    if (data.refreshToken) {
      setLocalStorageItem('refresh_token', data.refreshToken);
    }
    
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

export const getUserInfo = async (): Promise<UserData> => {
  try {
    console.log('Fetching user info');
    const response = await axiosInstance.get('/auth/me');
    console.log('User info response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get user info error:', error);
    throw error.response?.data || error;
  }
};

export const logout = () => {
  console.log('authApi: Logging out and clearing all tokens');
  removeLocalStorageItem('access_token');
  removeLocalStorageItem('refresh_token');
  
  // Clear any other potential auth-related localStorage items
  removeLocalStorageItem('user');
  removeLocalStorageItem('authState');
  
  // Clear all localStorage items that might contain sensitive data
  if (typeof window !== 'undefined') {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('token') || key.includes('auth') || key.includes('user'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

export const isAuthenticated = (): boolean => {
  const token = getLocalStorageItem('access_token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getTokenExpiration = (): number | null => {
  const token = getLocalStorageItem('access_token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp;
  } catch (error) {
    return null;
  }
};
