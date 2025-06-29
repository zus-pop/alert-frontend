'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Types
interface JwtPayload {
  sub: string;
  email: string;
  type: string;
  exp: number;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-alert-5ea310f83e0b.herokuapp.com/api';

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Hook to get a valid access token
export function useValidAccessToken() {
  return useQuery({
    queryKey: ['validAccessToken'],
    queryFn: async () => {
      console.log('Validating access token');
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      // If no tokens, return null
      if (!accessToken || !refreshToken) {
        console.log('No tokens found');
        return null;
      }
      
      // If access token is valid, return it
      if (!isTokenExpired(accessToken)) {
        console.log('Access token is valid');
        return accessToken;
      }
      
      // If refresh token is valid, use it to get a new access token
      if (!isTokenExpired(refreshToken)) {
        console.log('Access token expired, attempting to refresh');
        try {
          const response = await axios.get<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          console.log('Token refresh successful');
          
          // Save the new tokens
          localStorage.setItem('access_token', newAccessToken);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          return newAccessToken;
        } catch (error) {
          // If refresh fails, clear tokens and return null
          console.error('Token refresh failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return null;
        }
      }
      
      // If both tokens are expired, clear and return null
      console.log('Both tokens expired');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 4 * 60 * 1000, // 4 minutes (refresh before expiration)
  });
}
