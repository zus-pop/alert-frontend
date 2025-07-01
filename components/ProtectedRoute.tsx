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
        console.log("ProtectedRoute: Authenticated user trying to access login page, redirecting to dashboard");
        if (user?.role === 'ADMIN') {
          router.replace('/admin/system-users');
          return;
        } else if (user?.role === 'SUPERVISOR') {
          router.replace('/supervisor');
          return;
        } else if (user?.role === 'MANAGER') {
          router.replace('/manager');
          return;
        }
      }

      if (!isAuthenticated || validToken === null) {
        console.log("ProtectedRoute: Redirecting to login");
        router.push('/');
        return;
      }
      
      if (user) {
        const currentPath = window.location.pathname;
        
        const isAdminPath = currentPath.startsWith('/admin/system-users')
        const isSupervisorPath = currentPath.startsWith('/supervisor');
        const isManagerPath = currentPath.startsWith('/manager');
        
        if (user.role === 'ADMIN') {
          if (!isAdminPath && (isSupervisorPath || isManagerPath)) {
            console.log("ProtectedRoute: Admin accessing non-admin area, redirecting to admin");
            router.push('/admin/system-users');
            return;
          }
        } else if (user.role === 'SUPERVISOR') {
          if (!isSupervisorPath && (isAdminPath || isManagerPath)) {
            console.log("ProtectedRoute: Supervisor accessing non-supervisor area, redirecting to supervisor");
            router.push('/supervisor');
            return;
          }
        } else if (user.role === 'MANAGER') {
          if (!isManagerPath && (isAdminPath || isSupervisorPath)) {
            console.log("ProtectedRoute: Manager accessing non-manager area, redirecting to manager");
            router.push('/manager');
            return;
          }
        }
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          console.log("ProtectedRoute: Role mismatch for specific page, redirecting", user.role);
          if (user.role === 'ADMIN') {
            router.push('/admin/system-users');
          } else if (user.role === 'SUPERVISOR') {
            router.push('/supervisor');
          } else if (user.role === 'MANAGER') {
            router.push('/manager');
          } else {
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
