import { BookOpen, ArrowLeft, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types';
import { SaveStatus } from '@/hooks/useCourseEditor';

interface CourseDetailHeaderProps {
  isNewCourse: boolean;
  course: Course | null;
  saveStatus: SaveStatus;
  onEditDetails: () => void;
}

const CourseDetailHeader = ({ 
  isNewCourse, 
  course, 
  saveStatus,
  onEditDetails
}: CourseDetailHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <Button 
          variant="ghost" 
          className="mb-2 -ml-2 text-white/70 hover:text-white hover:bg-cyber-light"
          onClick={() => navigate('/admin/courses')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to courses
        </Button>
        <h1 className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center">
          <BookOpen className="h-7 w-7 text-neon-green mr-2" />
          <span>{isNewCourse ? 'Create New Course' : `Edit Course: ${course?.name}`}</span>
        </h1>
        {!isNewCourse && course?.lastUpdate && (
          <p className="text-white/60 text-sm">
            Last updated: {new Date(course.lastUpdate).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {!isNewCourse && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            onClick={onEditDetails}
          >
            <Info className="h-4 w-4 mr-2" />
            Edit Course Details
          </Button>
          <Button 
            className="bg-neon-green hover:bg-neon-green/90 text-black flex items-center gap-2"
            disabled={saveStatus === 'saving'}
            onClick={() => navigate('/admin/courses')}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Done'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseDetailHeader; 