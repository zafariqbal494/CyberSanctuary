import { Lesson } from '@/types';
import { Clock, Zap } from 'lucide-react';

interface LessonItemProps {
  /** Lesson data to display */
  lesson: Lesson;
}

/**
 * Component for rendering a single lesson item in the enhanced module list
 */
export const LessonItem = ({ lesson }: LessonItemProps) => {
  return (
    <div className="flex items-center justify-between bg-cyber-dark/40 p-2 md:p-3 rounded-lg hover:bg-cyber-dark/60 transition-colors duration-200">
      <div className="flex items-start flex-1 min-w-0">
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-cyber-darker flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 mt-0.5">
          <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-neon-green" />
        </div>
        <span className="text-xs md:text-sm break-words">{lesson.title}</span>
      </div>
      <div className="flex items-center text-white/60 text-[10px] md:text-xs ml-2 flex-shrink-0">
        <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 text-neon-green" />
        <span>{lesson.durationMinutes} min</span>
      </div>
    </div>
  );
}; 