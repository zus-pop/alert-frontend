import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Skeleton className="h-10 w-64" />
        </div>
      </CardContent>
    </Card>
  );
}
