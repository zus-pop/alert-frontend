"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'supervisor') {
          router.push('/supervisor');
        } else if (user.role === 'manager') {
          router.push('/manager');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B4D8]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  
  return <>{children}</>;
}
