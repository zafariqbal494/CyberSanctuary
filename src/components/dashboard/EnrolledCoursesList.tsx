import { EnrolledCourse } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '@/services/userService';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { generateSizes } from '@/utils/imageUtils';

interface EnrolledCoursesListProps {
  courses: EnrolledCourse[];
  loading: boolean;
}

const EnrolledCoursesList = ({ courses, loading }: EnrolledCoursesListProps) => {
  const navigate = useNavigate();

  // Define responsive sizes for course images
  const imageSizes = generateSizes({
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    default: '25vw'
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="bg-cyber-light border-neon-green/30">
            <CardHeader className="pb-2">
              <Skeleton className="h-40 w-full rounded-md mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border border-dashed border-white/20 rounded-md">
        <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <h3 className="text-lg font-mono text-white mb-2">No Courses Yet</h3>
        <p className="text-white/60 mb-4">You haven't enrolled in any courses yet.</p>
        <Button 
          variant="outline" 
          className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          onClick={() => navigate('/courses')}
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((enrollment) => (
        <Card key={enrollment.course.id} className="bg-cyber-light border-neon-green/30 text-white flex flex-col">
          <CardContent className="p-4 pb-2">
            <div className="overflow-hidden bg-black aspect-video rounded-md border border-neon-green/30">
              <ResponsiveImage
                src={getFullImageUrl(enrollment.course.image_url)}
                alt={enrollment.course.name}
                width={640}
                height={360}
                aspectRatio="16/9"
                objectFit="cover"
                className="w-full h-full"
                sizes={imageSizes}
                quality={85}
              />
            </div>
          </CardContent>
          <CardHeader className="p-4 pt-0 pb-2">
            <CardTitle className="text-lg font-mono">{enrollment.course.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow flex flex-col">
            <p className="text-sm text-white/60 line-clamp-2 mb-4 flex-grow">{enrollment.course.description}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 border-neon-green/30 text-neon-green hover:bg-neon-green/10"
              onClick={() => navigate(`/courses/${enrollment.course.id}`)}
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnrolledCoursesList; 