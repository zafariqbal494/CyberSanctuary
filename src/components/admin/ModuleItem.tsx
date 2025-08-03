import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Module, Lesson } from '@/types';
import { Pencil, Trash2, Clock, ListChecks, Plus } from 'lucide-react';
import LessonItem from './LessonItem';
import ModuleControls from './ModuleControls';

interface ModuleItemProps {
  module: Module;
  moduleIndex: number;
  onEditModule: (module: Module, index: number) => void;
  onDeleteModule: (index: number) => void;
  onAddLesson: (moduleIndex: number) => void;
  onEditLesson: (lesson: Lesson, moduleIndex: number, lessonIndex: number) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
  onMoveLessonUp: (moduleIndex: number, lessonIndex: number) => void;
  onMoveLessonDown: (moduleIndex: number, lessonIndex: number) => void;
  totalModules: number;
  onMoveModuleUp: (index: number) => void;
  onMoveModuleDown: (index: number) => void;
}

const ModuleItem = ({
  module,
  moduleIndex,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onMoveLessonUp,
  onMoveLessonDown,
  totalModules,
  onMoveModuleUp,
  onMoveModuleDown
}: ModuleItemProps) => {
  return (
    <Card className="bg-cyber-dark border-neon-green/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-mono text-white flex items-center">
              <span className="bg-neon-green/10 text-neon-green w-8 h-8 flex items-center justify-center rounded-full mr-2 text-sm">
                {moduleIndex + 1}
              </span>
              {module.title}
            </h3>
            <p className="text-white/60 text-sm mt-1 ml-10">{module.description}</p>
            <div className="flex items-center gap-3 ml-10 mt-2 text-xs text-white/50">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{module.durationMinutes} min</span>
              </div>
              <div className="flex items-center">
                <ListChecks className="h-3 w-3 mr-1" />
                <span>{module.lessons.length} lessons</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Module controls for reordering */}
            <ModuleControls 
              moduleIndex={moduleIndex}
              totalModules={totalModules}
              onMoveUp={onMoveModuleUp}
              onMoveDown={onMoveModuleDown}
            />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-neon-green hover:bg-neon-green/10"
              onClick={() => onEditModule(module, moduleIndex)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:bg-red-500/10"
              onClick={() => onDeleteModule(moduleIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Lessons */}
        <div className="ml-10 space-y-3 mt-4">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lessonIndex={lessonIndex}
              moduleIndex={moduleIndex}
              totalLessons={module.lessons.length}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onMoveLessonUp={onMoveLessonUp}
              onMoveLessonDown={onMoveLessonDown}
            />
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 ml-auto block"
            onClick={() => onAddLesson(moduleIndex)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleItem; 