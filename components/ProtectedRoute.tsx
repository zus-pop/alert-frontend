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

  // Ensure this runs on every render
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
    
    // Only check after token validation has completed
    if (!loading && !tokenLoading) {
      if (!isAuthenticated || validToken === null) {
        console.log("ProtectedRoute: Redirecting to login");
        router.push('/login');
      } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        console.log("ProtectedRoute: Role mismatch, redirecting", user.role);
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else if (user.role === 'STAFF') {
          router.push('/supervisor');
        } else if (user.role === 'MANAGER') {
          router.push('/manager');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router, validToken, tokenLoading]);

  // Show loading indicator while checking authentication or token
  if (loading || tokenLoading) {
    console.log("ProtectedRoute: Showing loading indicator");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B4D8]"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || validToken === null) {
    console.log("ProtectedRoute: Not authenticated, returning null");
    return null;
  }

  // Don't render children if user doesn't have required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute: User doesn't have required role, returning null");
    return null;
  }

  // User is authenticated and has required role, render children
  console.log("ProtectedRoute: Authenticated with required role, rendering children");
  return <>{children}</>;
}
