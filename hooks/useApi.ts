'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Get the base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-alert-5ea310f83e0b.herokuapp.com/api';

// Create axios instance with auth interceptors (same as in authApi.ts)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This function will handle API errors consistently
const handleApiError = (error: any) => {
  const errorMessage = error.response?.data?.message || 'An error occurred';
  toast({
    variant: 'destructive',
    title: 'Error',
    description: errorMessage,
  });
  return Promise.reject(error);
};

// Generic hook for GET requests
export function useApiGet<T>(
  endpoint: string, 
  queryKey: string[], 
  options = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.get<T>(endpoint);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    ...options,
  });
}

// Generic hook for POST requests
export function useApiPost<T, R>(
  endpoint: string,
  options = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: T) => {
      try {
        const response = await api.post<R>(endpoint, data);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    ...options,
  });
}

// Generic hook for PUT requests
export function useApiPut<T, R>(
  endpoint: string,
  options = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: T }) => {
      try {
        const response = await api.put<R>(`${endpoint}/${id}`, data);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    ...options,
  });
}

// Generic hook for DELETE requests
export function useApiDelete<R>(
  endpoint: string,
  options = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete<R>(`${endpoint}/${id}`);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    ...options,
  });
}

// Export the api instance for direct usage when needed
export { api };
