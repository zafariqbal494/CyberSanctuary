import { Clock, Video } from 'lucide-react';

interface ModuleMetaInfoProps {
  /** Number of lessons in the module */
  lessonCount: number;
  /** Total duration of the module in minutes */
  durationMinutes: number;
}

/**
 * Component for displaying module metadata (lesson count and duration)
 */
export const ModuleMetaInfo = ({ lessonCount, durationMinutes }: ModuleMetaInfoProps) => {
  return (
    <div className="flex items-center text-[10px] md:text-xs text-white/60">
      <div className="flex items-center mr-3 md:mr-4">
        <Video className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
        <span>{lessonCount} Lessons</span>
      </div>
      <div className="flex items-center">
        <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
        <span>{durationMinutes} min total</span>
      </div>
    </div>
  );
}; 