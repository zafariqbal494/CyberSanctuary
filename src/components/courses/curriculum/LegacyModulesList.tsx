import { ModulesListProps, ModuleToggleHandler } from './types';
import { ModuleHeader, ModuleContent } from './shared';

/**
 * Legacy module list with simple description
 */
export const LegacyModulesList = ({ modules, openItem, setOpenItem }: ModulesListProps) => {
  /**
   * Handles click on module header to toggle expansion
   */
  const handleModuleToggle = (index: number): ModuleToggleHandler => (event) => {
    event.preventDefault();
    setOpenItem(openItem === `item-${index}` ? undefined : `item-${index}`);
  };

  return (
    <>
      {modules.map((module, index) => {
        const isOpen = openItem === `item-${index}`;
        const headingId = `module-heading-legacy-${index}`;
        const contentId = `module-content-legacy-${index}`;
        
        return (
          <div key={index} className="py-3 md:py-5">
            <ModuleHeader
              index={index}
              title={module.title}
              isOpen={isOpen}
              onToggle={handleModuleToggle(index)}
              contentId={contentId}
              headingId={headingId}
            />
            
            <ModuleContent
              isVisible={isOpen}
              id={contentId}
              headingId={headingId}
            >
              <p className="text-xs md:text-sm pl-2 md:pl-4">{module.description}</p>
            </ModuleContent>
          </div>
        );
      })}
    </>
  );
}; 