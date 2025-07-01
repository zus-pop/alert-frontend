'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, 
        retry: 1,
        refetchOnWindowFocus: false,
        gcTime: 2 * 60 * 1000, // Reduced to 2 minutes (from 5 minutes)
      },
      mutations: {
        retry: 1,
        gcTime: 0, // Don't cache mutations
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
