"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, useLogout, useUserInfo } from '@/hooks/useAuth';
import { isAuthenticated } from '@/services/authApi';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
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
  
  // Using TanStack Query hooks
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: userData, isLoading: isLoadingUserInfo, error: userInfoError, refetch } = useUserInfo(isAuthenticated());

  useEffect(() => {
    // If we have user data from the query, update the state
    if (userData) {
      console.log('AuthContext: User data updated', userData);
      setUser(userData);
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
    }
  }, [refetch]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    console.log('AuthContext: Login attempt', email);
    try {
      await loginMutation.mutateAsync({ email, password });
      console.log('AuthContext: Login successful, fetching user info');
      
      // After login, get user info
      const result = await refetch();
      const userData = result.data;
      
      if (userData) {
        console.log('AuthContext: User data received after login', userData);
        setUser(userData);
        setIsAuth(true);
        
        if (userData.role === 'ADMIN') {
          router.push('/admin');
        } else if (userData.role === 'STAFF') {
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

  const handleLogout = () => {
    logoutMutation.mutate();
    setUser(null);
    setIsAuth(false);
  };

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
