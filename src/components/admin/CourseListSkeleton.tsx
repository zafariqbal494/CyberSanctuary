import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseListSkeletonProps {
  count?: number;
}

const CourseListSkeleton = ({ count = 3 }: CourseListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-cyber-light border-neon-green/30">
          <CardContent className="p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-12 flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseListSkeleton; 