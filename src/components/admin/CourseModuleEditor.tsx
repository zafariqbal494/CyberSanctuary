import { useState, useEffect } from 'react';
import { Module, Lesson } from '@/types';
import { Button } from "@/components/ui/button";
import { Layers, Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Import the new components
import ModuleItem from './ModuleItem';
import ModuleFormDialog from './ModuleFormDialog';
import LessonFormDialog from './LessonFormDialog';

interface CourseModuleEditorProps {
  courseId: string;
  initialModules: Module[];
  onSave: (modules: Module[]) => void;
}

const CourseModuleEditor = ({ courseId, initialModules, onSave }: CourseModuleEditorProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);
  
  // Form states for module
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleDuration, setModuleDuration] = useState(0);
  
  // Form states for lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState(0);
  const [lessonType, setLessonType] = useState('video');
  
  useEffect(() => {
    // Initialize modules from props
    setModules(initialModules || []);
  }, [initialModules]);
  
  // Module CRUD operations
  const handleAddModule = () => {
    setCurrentModule(null);
    setModuleTitle('');
    setModuleDescription('');
    setModuleDuration(0);
    setIsModuleModalOpen(true);
  };
  
  const handleEditModule = (module: Module, index: number) => {
    setCurrentModule(module);
    setCurrentModuleIndex(index);
    setModuleTitle(module.title);
    setModuleDescription(module.description);
    setModuleDuration(module.durationMinutes);
    setIsModuleModalOpen(true);
  };
  
  const handleDeleteModule = (index: number) => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
    toast({
      title: "Module Deleted",
      description: "The module has been removed"
    });
  };
  
  const handleSaveModule = () => {
    if (!moduleTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a module title",
        variant: "destructive"
      });
      return;
    }
    
    const moduleData: Module = {
      id: currentModule?.id || Math.floor(Math.random() * 10000),
      title: moduleTitle,
      description: moduleDescription,
      durationMinutes: moduleDuration,
      lessons: currentModule?.lessons || []
    };
    
    const newModules = [...modules];
    if (currentModule) {
      // Update existing module
      if (currentModuleIndex !== null) {
        newModules[currentModuleIndex] = moduleData;
      }
    } else {
      // Add new module
      newModules.push(moduleData);
    }
    
    setModules(newModules);
    setIsModuleModalOpen(false);
    
    toast({
      title: currentModule ? "Module Updated" : "Module Added",
      description: `Module "${moduleTitle}" has been ${currentModule ? 'updated' : 'added'}`
    });
  };
  
  // Lesson CRUD operations
  const handleAddLesson = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLesson(null);
    setLessonTitle('');
    setLessonDuration(0);
    setLessonType('video');
    setIsLessonModalOpen(true);
  };
  
  const handleEditLesson = (lesson: Lesson, moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.durationMinutes);
    setLessonType(lesson.type);
    setIsLessonModalOpen(true);
  };
  
  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(newModules);
    
    toast({
      title: "Lesson Deleted",
      description: "The lesson has been removed"
    });
  };
  
  const handleSaveLesson = () => {
    if (!lessonTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a lesson title",
        variant: "destructive"
      });
      return;
    }
    
    if (currentModuleIndex === null) return;
    
    const lessonData: Lesson = {
      id: currentLesson?.id || Math.floor(Math.random() * 10000),
      title: lessonTitle,
      durationMinutes: lessonDuration,
      type: lessonType
    };
    
    const newModules = [...modules];
    if (currentLesson) {
      // Find the lesson index and update it
      const lessonIndex = newModules[currentModuleIndex].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      );
      if (lessonIndex !== -1) {
        newModules[currentModuleIndex].lessons[lessonIndex] = lessonData;
      }
    } else {
      // Add new lesson
      newModules[currentModuleIndex].lessons.push(lessonData);
    }
    
    // Update total module duration
    newModules[currentModuleIndex].durationMinutes = newModules[currentModuleIndex].lessons.reduce(
      (total, lesson) => total + lesson.durationMinutes, 0
    );
    
    setModules(newModules);
    setIsLessonModalOpen(false);
    
    toast({
      title: currentLesson ? "Lesson Updated" : "Lesson Added",
      description: `Lesson "${lessonTitle}" has been ${currentLesson ? 'updated' : 'added'}`
    });
  };
  
  // Reordering modules and lessons
  const moveModuleUp = (index: number) => {
    if (index === 0) return;
    const newModules = [...modules];
    [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    setModules(newModules);
  };
  
  const moveModuleDown = (index: number) => {
    if (index === modules.length - 1) return;
    const newModules = [...modules];
    [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
    setModules(newModules);
  };
  
  const moveLessonUp = (moduleIndex: number, lessonIndex: number) => {
    if (lessonIndex === 0) return;
    const newModules = [...modules];
    const lessons = [...newModules[moduleIndex].lessons];
    [lessons[lessonIndex - 1], lessons[lessonIndex]] = [lessons[lessonIndex], lessons[lessonIndex - 1]];
    newModules[moduleIndex].lessons = lessons;
    setModules(newModules);
  };
  
  const moveLessonDown = (moduleIndex: number, lessonIndex: number) => {
    const moduleLength = modules[moduleIndex].lessons.length;
    if (lessonIndex === moduleLength - 1) return;
    const newModules = [...modules];
    const lessons = [...newModules[moduleIndex].lessons];
    [lessons[lessonIndex], lessons[lessonIndex + 1]] = [lessons[lessonIndex + 1], lessons[lessonIndex]];
    newModules[moduleIndex].lessons = lessons;
    setModules(newModules);
  };
  
  // Handle save for the entire module structure
  const handleSaveAll = () => {
    onSave(modules);
    toast({
      title: "Curriculum Saved",
      description: "The course curriculum has been updated"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-mono font-semibold text-white flex items-center">
          <Layers className="h-5 w-5 text-neon-green mr-2" />
          Course Curriculum
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            onClick={handleAddModule}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
          <Button 
            className="bg-neon-green hover:bg-neon-green/90 text-black"
            onClick={handleSaveAll}
          >
            Save Curriculum
          </Button>
        </div>
      </div>
      
      {modules.length === 0 ? (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-neon-green/20">
          <Layers className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/70 mb-2">No modules in this course yet.</p>
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 mt-2" 
            onClick={handleAddModule}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Module
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <ModuleItem
              key={module.id}
              module={module}
              moduleIndex={moduleIndex}
              totalModules={modules.length}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              onAddLesson={handleAddLesson}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onMoveLessonUp={moveLessonUp}
              onMoveLessonDown={moveLessonDown}
              onMoveModuleUp={moveModuleUp}
              onMoveModuleDown={moveModuleDown}
            />
          ))}
        </div>
      )}
      
      {/* Module Form Dialog */}
      <ModuleFormDialog
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
        module={currentModule}
        moduleTitle={moduleTitle}
        moduleDescription={moduleDescription}
        moduleDuration={moduleDuration}
        onTitleChange={setModuleTitle}
        onDescriptionChange={setModuleDescription}
        onDurationChange={setModuleDuration}
      />
      
      {/* Lesson Form Dialog */}
      <LessonFormDialog
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        lesson={currentLesson}
        lessonTitle={lessonTitle}
        lessonDuration={lessonDuration}
        lessonType={lessonType}
        onTitleChange={setLessonTitle}
        onDurationChange={setLessonDuration}
        onTypeChange={setLessonType}
      />
    </div>
  );
};

export default CourseModuleEditor; 