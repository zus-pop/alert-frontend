'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingCombos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="border rounded-md">
        <div className="h-12 px-4 border-b flex items-center">
          <Skeleton className="h-5 w-full" />
        </div>

        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-6 w-1/6" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/5" />
              <div className="ml-auto flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-72" />
      </div>
    </div>
  );
}
