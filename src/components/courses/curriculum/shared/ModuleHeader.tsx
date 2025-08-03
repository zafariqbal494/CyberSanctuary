import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Lock } from 'lucide-react';
import { ModuleToggleHandler } from '../types';

interface ModuleHeaderProps {
  /** Index of the module */
  index: number;
  /** Title of the module */
  title: string;
  /** Whether this module is currently open */
  isOpen: boolean;
  /** Handler for toggling the module open/closed */
  onToggle: ModuleToggleHandler;
  /** ID of the content section this header controls */
  contentId: string;
  /** ID for this header element */
  headingId: string;
  /** Optional additional content to render in the header */
  metaContent?: ReactNode;
}

/**
 * Shared module header component used by both enhanced and legacy module lists
 */
export const ModuleHeader = ({
  index,
  title,
  isOpen,
  onToggle,
  contentId,
  headingId,
  metaContent
}: ModuleHeaderProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between cursor-pointer py-2 md:py-3 px-2 md:px-4",
        "hover:bg-neon-green/5 rounded-lg transition-colors duration-200",
        isOpen ? "bg-neon-green/10" : ""
      )}
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      tabIndex={0}
    >
      <div className="flex items-center w-full">
        {/* Module number badge */}
        <div className={cn(
          "relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl mr-2 md:mr-4", 
          "border-2 border-neon-green/50 bg-cyber-light/30 text-neon-green font-mono font-bold text-sm md:text-base"
        )}>
          {index + 1}
          <div className="absolute -right-1 -top-1 w-3 h-3 md:w-5 md:h-5 bg-neon-green rounded-full flex items-center justify-center text-black text-[8px] md:text-xs">
            <Lock className="w-2 h-2 md:w-3 md:h-3" />
          </div>
        </div>
        
        {/* Module title and optional meta content */}
        <div className="flex-1 min-w-0">
          <h3 
            id={headingId}
            className={cn(
              "font-mono text-sm md:text-lg transition-colors duration-200",
              isOpen ? "text-neon-green" : "text-white",
              isOpen ? "line-clamp-none" : "truncate",
              metaContent ? "mb-0.5 md:mb-1" : ""
            )}
          >
            {title}
          </h3>
          {metaContent}
        </div>
        
        {/* Expand/collapse icon */}
        <ChevronRight className={cn(
          "w-4 h-4 md:w-5 md:h-5 text-white/60 transition-transform duration-200 flex-shrink-0 ml-2",
          isOpen ? "rotate-90 text-neon-green" : ""
        )} />
      </div>
    </div>
  );
}; 