'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientSideProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientSideProvider({ 
  children, 
  fallback = null 
}: ClientSideProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
