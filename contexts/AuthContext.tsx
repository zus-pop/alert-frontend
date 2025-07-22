"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';
  import { useRouter} from 'next/navigation';
import { useLogin, useLogout, useUserInfo } from '@/hooks/useAuth';
import { isAuthenticated } from '@/services/authApi';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  _id?: string;
  email: string;
  role: string;
  lastName?: string;
  firstName?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Using TanStack Query hooks
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: userData, isLoading: isLoadingUserInfo, error: userInfoError, refetch } = useUserInfo(isAuthenticated());

  useEffect(() => {
    // If we have user data from the query, update the state
    if (userData) {
      console.log('AuthContext: User data updated', userData);
      const _userData = userData as any; // ép kiểu tạm thời để lấy _id
      setUser({
        ...userData,
        id: _userData._id || userData.id
      });
      setIsAuth(true);
    }
  }, [userData]);

  useEffect(() => {
    // Check authentication on mount
    console.log('AuthContext: Checking authentication on mount', isAuthenticated());
    if (isAuthenticated()) {
      refetch();
    } else {
      setUser(null);
      setIsAuth(false);
      // Ensure no cached data remains if not authenticated
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      queryClient.removeQueries({ queryKey: ['validAccessToken'] });
    }
  }, [refetch, queryClient]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    console.log('AuthContext: Login attempt', email);
    try {
      await loginMutation.mutateAsync({ email, password });
      console.log('AuthContext: Login successful, fetching user info');
      
      // Reset state và cache
      setUser(null);
      setIsAuth(false);
      
      // Xóa toàn bộ cache trước khi refetch
      await queryClient.resetQueries({ queryKey: ['userInfo'] });
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      
      // Sau khi xóa cache, refetch với token mới
      const result = await refetch();
      const userData = result.data;
      
      if (userData) {
        console.log('AuthContext: User data received after login', userData);
        setUser(userData);
        setIsAuth(true);
        
        if (userData.role === 'ADMIN') {
          router.push('/admin/system-users');
        } else if (userData.role === 'SUPERVISOR') {
          router.push('/supervisor');
        } else if (userData.role === 'MANAGER') {
          router.push('/manager');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('AuthContext: Login error', err);
      setError(err.message || 'Login failed');
      setIsAuth(false);
    }
  };

  const handleLogout = async () => {
    console.log('1. Starting logout process');
    
    // Hủy tất cả query đang pending
    await queryClient.cancelQueries();
    console.log('2. Queries canceled');
    
    // Set auth state to false ngay lập tức
    setUser(null);
    setIsAuth(false);
    setError(null);
    console.log('3. Auth state reset');
    
     localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.clear();
    // Thực hiện logout mutation
    try {
      await logoutMutation.mutateAsync();
      console.log('5. Logout mutation completed');
    } catch (err) {
      console.error('Logout mutation failed:', err);
    }

    
   queryClient.removeQueries({ queryKey: ['userInfo'], exact: false });
  queryClient.invalidateQueries({ queryKey: ['userInfo'], exact: false });
   queryClient.clear(); // Clear toàn bộ cache (nếu cần)
  console.log('🧹 Đã clear cache user');

  // 6. Chuyển hướng về trang login/home
  window.location.href = '/';
  };

  useEffect(() => {
    // Khi token thay đổi, reset user state và force refetch
    const handleTokenChange = () => {
      console.log('AuthContext: Token changed, resetting user state');
      setUser(null);
      setIsAuth(false);
      
      // Force refetch user info với token mới
      if (isAuthenticated()) {
        queryClient.removeQueries({ queryKey: ['userInfo'] });
        refetch();
      }
    };
    
    // Kiểm tra token thay đổi
    window.addEventListener('storage', (e) => {
      if (e.key === 'access_token') {
        handleTokenChange();
      }
    });
    
    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [refetch, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoadingUserInfo || loginMutation.isPending,
        error: error || (userInfoError ? String(userInfoError) : null),
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
