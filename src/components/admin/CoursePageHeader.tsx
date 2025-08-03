import { BookOpen, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CoursePageHeaderProps {
  onCreateCourse: () => void;
}

const CoursePageHeader = ({ onCreateCourse }: CoursePageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center">
          <BookOpen className="h-7 w-7 text-neon-green mr-2" />
          <span>Course <span className="text-neon-green">Management</span></span>
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Add, edit, and manage your cybersecurity courses
        </p>
      </div>
      
      <Button 
        className="bg-neon-green hover:bg-neon-green/90 text-black font-mono"
        onClick={onCreateCourse}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Course
      </Button>
    </div>
  );
};

export default CoursePageHeader; 