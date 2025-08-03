import { Button } from "@/components/ui/button";
import { Lesson } from '@/types';
import { Pencil, Trash2, Video, Book, Code, FileEdit, PlayCircle, Clock } from 'lucide-react';

interface LessonItemProps {
  lesson: Lesson;
  lessonIndex: number;
  moduleIndex: number;
  totalLessons: number;
  onEditLesson: (lesson: Lesson, moduleIndex: number, lessonIndex: number) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
  onMoveLessonUp: (moduleIndex: number, lessonIndex: number) => void;
  onMoveLessonDown: (moduleIndex: number, lessonIndex: number) => void;
}

const LessonItem = ({
  lesson,
  lessonIndex,
  moduleIndex,
  totalLessons,
  onEditLesson,
  onDeleteLesson,
  onMoveLessonUp,
  onMoveLessonDown
}: LessonItemProps) => {
  
  // Get lesson type icon
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-400" />;
      case 'reading': return <Book className="h-4 w-4 text-green-400" />;
      case 'practical': return <Code className="h-4 w-4 text-yellow-400" />;
      case 'exercise': return <FileEdit className="h-4 w-4 text-purple-400" />;
      case 'lab': return <PlayCircle className="h-4 w-4 text-red-400" />;
      default: return <Video className="h-4 w-4 text-blue-400" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between bg-cyber-light p-3 rounded-lg border border-neon-green/10">
      <div className="flex items-center">
        {getLessonTypeIcon(lesson.type)}
        <span className="ml-3 text-white">{lesson.title}</span>
        <span className="ml-3 text-xs text-white/50 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {lesson.durationMinutes} min
        </span>
      </div>
      <div className="flex items-center gap-1">
        {/* Up arrow button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/5"
          onClick={() => onMoveLessonUp(moduleIndex, lessonIndex)}
          disabled={lessonIndex === 0}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </Button>
        
        {/* Down arrow button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/5"
          onClick={() => onMoveLessonDown(moduleIndex, lessonIndex)}
          disabled={lessonIndex === totalLessons - 1}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
        
        {/* Edit button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-neon-green hover:bg-neon-green/10"
          onClick={() => onEditLesson(lesson, moduleIndex, lessonIndex)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        {/* Delete button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10"
          onClick={() => onDeleteLesson(moduleIndex, lessonIndex)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonItem; 