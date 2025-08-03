import { BookOpen, Edit, Trash2, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from '@/types';
import { getCourseImageUrl } from '@/services/courseService';
import { ResponsiveImage } from '@/components/ui/responsive-image';

interface CourseListItemProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onUpdatePurchases: (course: Course) => void;
}

const CourseListItem = ({ 
  course, 
  onEdit, 
  onDelete, 
  onUpdatePurchases 
}: CourseListItemProps) => {
  return (
    <Card className="bg-cyber-light border-neon-green/30 hover:border-neon-green/50 transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
          <div className="bg-cyber-dark p-3 rounded-md border border-neon-green/20 flex-shrink-0">
            {course.image_url ? (
              <ResponsiveImage 
                src={getCourseImageUrl(course.image_url)}
                alt={course.name}
                width={48}
                height={48}
                className="w-12 h-12"
                objectFit="cover"
              />
            ) : (
              <BookOpen className="h-6 w-6 text-neon-green" />
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <h3 className="text-white font-mono font-semibold text-lg truncate">{course.name}</h3>
            <p className="text-white/70 text-sm truncate">{course.shortDescription}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-white/60">Price: ${course.price}</span>
              <span className="text-xs text-white/60">Purchases: {course.purchases_count || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
              onClick={() => onUpdatePurchases(course)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Purchases
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
              onClick={() => onEdit(course)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={() => onDelete(course)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseListItem; 