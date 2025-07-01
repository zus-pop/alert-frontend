"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Login from "./login/page";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("HomePage: User already authenticated, redirecting to appropriate dashboard");
      if (user.role === 'ADMIN') {
        router.push('/admin/system-users');
      } else if (user.role === 'SUPERVISOR') {
        router.push('/supervisor');
      } else if (user.role === 'MANAGER') {
        router.push('/manager');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[#00B4D8] p-8">
      <Login />
    </div>
  );
}
