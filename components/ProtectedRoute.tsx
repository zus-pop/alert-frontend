"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useValidAccessToken } from '@/hooks/useToken';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const { data: validToken, isLoading: tokenLoading } = useValidAccessToken();
  const router = useRouter();

  console.log("ProtectedRoute rendering - Auth state:", {
    isAuthenticated,
    user,
    validToken: validToken ? "valid" : "invalid",
    tokenLoading,
    allowedRoles
  });

  useEffect(() => {
    console.log("ProtectedRoute useEffect - Auth check:", {
      isAuthenticated,
      user,
      loading,
      tokenLoading,
      validToken: validToken ? "valid" : "invalid"
    });
    
    if (!loading && !tokenLoading) {
      
      // Check if user is on login or home page and redirect based on role
      if (isAuthenticated && user && (window.location.pathname === '/' || window.location.pathname === '/login')) {
        const currentPath = String(window.location.pathname);
        if (user?.role === 'ADMIN') {
          if (currentPath !== '/admin/system-users') {
            router.replace('/admin/system-users');
            return;
          }
        } else if (user?.role === 'SUPERVISOR') {
          if (currentPath !== '/supervisor') {
            router.replace('/supervisor');
            return;
          }
        } else if (user?.role === 'MANAGER') {
          if (currentPath !== '/manager') {
            router.replace('/manager');
            return;
          }
        }
      }

      if (!isAuthenticated || validToken === null) {
        if (window.location.pathname !== '/') {
          router.push('/');
        }
        return;
      }
      
      if (user) {
        const currentPath = window.location.pathname;
        
        const isAdminPath = currentPath.startsWith('/admin/system-users')
        const isSupervisorPath = currentPath.startsWith('/supervisor');
        const isManagerPath = currentPath.startsWith('/manager');
        
        if (user.role === 'ADMIN') {
          if (!isAdminPath && (isSupervisorPath || isManagerPath) && window.location.pathname !== '/admin/system-users') {
            router.push('/admin/system-users');
            return;
          }
        } else if (user.role === 'SUPERVISOR') {
          if (!isSupervisorPath && (isAdminPath || isManagerPath) && window.location.pathname !== '/supervisor') {
            router.push('/supervisor');
            return;
          }
        } else if (user.role === 'MANAGER') {
          if (!isManagerPath && (isAdminPath || isSupervisorPath) && window.location.pathname !== '/manager') {
            router.push('/manager');
            return;
          }
        }
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          if (user.role === 'ADMIN' && window.location.pathname !== '/admin/system-users') {
            router.push('/admin/system-users');
          } else if (user.role === 'SUPERVISOR' && window.location.pathname !== '/supervisor') {
            router.push('/supervisor');
          } else if (user.role === 'MANAGER' && window.location.pathname !== '/manager') {
            router.push('/manager');
          } else if (window.location.pathname !== '/') {
            router.push('/');
          }
        }
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router, validToken, tokenLoading]);

  if (loading || tokenLoading) {
    console.log("ProtectedRoute: Showing loading indicator");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B4D8]"></div>
      </div>
    );
  }

  if (!isAuthenticated || validToken === null) {
    console.log("ProtectedRoute: Not authenticated, returning null");
    return null;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute: User doesn't have required role, returning null");
    return null;
  }

  console.log("ProtectedRoute: Authenticated with required role, rendering children");
  return <>{children}</>;
}
