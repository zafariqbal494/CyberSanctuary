import { ModulesListProps, ModuleToggleHandler } from './types';
import { 
  ModuleHeader, 
  ModuleContent, 
  LessonItem,
  ModuleMetaInfo 
} from './shared';

/**
 * Enhanced module list with detailed lesson information
 */
export const EnhancedModulesList = ({ modules, openItem, setOpenItem }: ModulesListProps) => {
  /**
   * Handles click on module header to toggle expansion
   */
  const handleModuleToggle = (moduleIndex: number): ModuleToggleHandler => (event) => {
    event.preventDefault();
    setOpenItem(openItem === `item-${moduleIndex}` ? undefined : `item-${moduleIndex}`);
  };

  return (
    <>
      {modules.map((module, moduleIndex) => {
        const isOpen = openItem === `item-${moduleIndex}`;
        const headingId = `module-heading-${moduleIndex}`;
        const contentId = `module-content-${moduleIndex}`;
        
        return (
          <div key={moduleIndex} className="py-3 md:py-5">
            <ModuleHeader
              index={moduleIndex}
              title={module.title}
              isOpen={isOpen}
              onToggle={handleModuleToggle(moduleIndex)}
              contentId={contentId}
              headingId={headingId}
              metaContent={
                <ModuleMetaInfo
                  lessonCount={module.lessons.length}
                  durationMinutes={module.durationMinutes}
                />
              }
            />
            
            <ModuleContent
              isVisible={isOpen}
              id={contentId}
              headingId={headingId}
            >
              <p className="text-xs md:text-sm pl-2 md:pl-4">{module.description}</p>
              
              {/* Lesson list */}
              <div className="space-y-2 md:space-y-3 pl-2 md:pl-4 mt-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <LessonItem key={lessonIndex} lesson={lesson} />
                ))}
              </div>
            </ModuleContent>
          </div>
        );
      })}
    </>
  );
}; 