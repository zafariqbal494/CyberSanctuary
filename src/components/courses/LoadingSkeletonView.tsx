import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSkeletonView = () => {
  return (
    <div className="container mx-auto px-4 py-12" data-testid="loading-skeleton">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}; 