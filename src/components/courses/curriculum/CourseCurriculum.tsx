import { useState } from 'react';
import { Book } from 'lucide-react';
import { CourseCurriculumProps } from './types';
import { EnhancedModulesList } from './EnhancedModulesList';
import { LegacyModulesList } from './LegacyModulesList';
import { CurriculumFooter } from './CurriculumFooter';
import { DEFAULT_TELEGRAM_LINK } from './constants';

/**
 * Main component for displaying course curriculum
 * Renders either enhanced or legacy view based on props
 */
const CourseCurriculum = ({ 
  modules, 
  useEnhanced,
  telegramLink = DEFAULT_TELEGRAM_LINK
}: CourseCurriculumProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  
  return (
    <div className="mt-4 md:mt-8 mb-3 md:mb-8">
      <div className="bg-cyber-darker relative p-0 rounded-xl overflow-hidden border border-neon-green/30">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyber-light to-cyber-darker relative overflow-hidden">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(0, 255, 170, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% -20%, rgba(0, 255, 170, 0.15) 0%, transparent 55%)',
            mixBlendMode: 'overlay'
          }}></div>
          
          <div className="relative p-4 md:p-6 flex items-start">
            <div className="flex items-center">
              <div className="bg-neon-green/10 p-2 md:p-3 rounded-lg border border-neon-green/30 mr-3 md:mr-4">
                <Book className="h-5 w-5 md:h-8 md:w-8 text-neon-green" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-mono font-bold text-white">Course Modules</h2>
                <p className="text-xs md:text-sm text-white/60">Master the complete cybersecurity curriculum</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modules List */}
        <div className="px-2 md:px-4">
          {useEnhanced ? (
            <EnhancedModulesList modules={modules} openItem={openItem} setOpenItem={setOpenItem} />
          ) : (
            <LegacyModulesList modules={modules} openItem={openItem} setOpenItem={setOpenItem} />
          )}
        </div>
        
        {/* Footer */}
        <CurriculumFooter telegramLink={telegramLink} />
      </div>
    </div>
  );
};

// Export as default for compatibility with React.lazy
export default CourseCurriculum;

// Also export as named export for backward compatibility
export { CourseCurriculum }; 