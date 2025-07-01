'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, getUserInfo, logout as logoutApi } from '@/services/authApi';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('useLogin: Attempting login', credentials.email);
      const result = await loginApi(credentials);
      console.log('useLogin: Login successful', result);
      return result;
    },
    onSuccess: () => {
      console.log('useLogin: Login mutation success');
      
      // Reset tất cả cache trước khi chuyển sang user mới
      queryClient.removeQueries();
      
      // Reset cụ thể cache user
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      queryClient.setQueryData(['userInfo'], null);
      
      // Force refetch dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
    onError: (error) => {
      console.error('useLogin: Login mutation error', error);
    }
  });
}

export function useUserInfo(enabled = true) {
  // Lấy token hiện tại để dùng làm query key
  const currentToken = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('access_token') 
    : null;
  
  return useQuery({
    // Sử dụng token làm một phần của query key
    queryKey: ['userInfo', currentToken],
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
    enabled: enabled && !!currentToken, 
    staleTime: 1000 * 30, // Giảm xuống chỉ 30 giây
    gcTime: 0, // Không cache sau khi unmount
    retry: 1,
    refetchOnMount: true, // Luôn refetch khi mount
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      console.log('useLogout: Logging out user');
      logoutApi();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('useLogout: Logout successful');
      
      // Reset toàn bộ cache liên quan đến user
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      queryClient.setQueryData(['userInfo'], null);
      
      // Buộc client không sử dụng cache cũ
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      
      console.log('useLogout: Cache cleared, redirecting to login');
      router.push('/');
    },
  });
}
