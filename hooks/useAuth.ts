'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { login as loginApi, getUserInfo, logout as logoutApi } from '@/services/authApi';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('useLogin: Attempting login', credentials.email);
      const result = await loginApi(credentials);
      console.log('useLogin: Login successful', result);
      return result;
    },
    onSuccess: (data, variables, context) => {
      console.log('useLogin: Login mutation success');
      // The login was successful, we can now get user info
      // Redirect will be handled in the auth context
    },
    onError: (error) => {
      console.error('useLogin: Login mutation error', error);
    }
  });
}

export function useUserInfo(enabled = true) {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      console.log('useUserInfo: Fetching user info');
      try {
        const result = await getUserInfo();
        console.log('useUserInfo: User info fetched successfully', result);
        return result;
      } catch (error) {
        console.error('useUserInfo: Error fetching user info', error);
        throw error;
      }
    },
    enabled: enabled, // Only fetch if enabled (user is authenticated)
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      console.log('useLogout: Logging out user');
      logoutApi();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('useLogout: Logout successful, redirecting to login');
      router.push('/login');
    },
  });
}
