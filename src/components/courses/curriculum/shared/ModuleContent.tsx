import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModuleContentProps {
  /** Whether this content is visible */
  isVisible: boolean;
  /** ID for this content section */
  id: string;
  /** ID of the heading that controls this content */
  headingId: string;
  /** Content to render inside the module */
  children: ReactNode;
}

/**
 * Shared module content component used by both enhanced and legacy module lists
 */
export const ModuleContent = ({
  isVisible,
  id,
  headingId,
  children
}: ModuleContentProps) => {
  if (!isVisible) return null;
  
  return (
    <div 
      id={id}
      className="mt-2 md:mt-3 space-y-3 md:space-y-4 text-white/80 px-1 md:px-4"
      role="region"
      aria-labelledby={headingId}
    >
      <div className="border-l-2 border-neon-green ml-1 md:ml-8">
        {children}
      </div>
    </div>
  );
}; 