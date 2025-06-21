"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, getUserInfo, isAuthenticated } from '@/services/api';
import { useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (isAuthenticated()) {
        try {
          const userData = await getUserInfo();
          setUser(userData);
          setIsAuth(true);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser(null);
          setIsAuth(false);
          logout(); 
        }
      } else {
        setUser(null);
        setIsAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      const userData = await getUserInfo();
      console.log('User data:', userData);
      setUser(userData);
      setIsAuth(true);
      
      if (userData.role === 'ADMIN') {
        router.push('/admin');
      } else if (userData.role === 'SUPERVISOR') {
        router.push('/supervisor');
      } else if (userData.role === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/');
      }
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

 
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuth(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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
