import { Button } from "@/components/ui/button";

interface ModuleControlsProps {
  moduleIndex: number;
  totalModules: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const ModuleControls = ({ 
  moduleIndex, 
  totalModules, 
  onMoveUp, 
  onMoveDown 
}: ModuleControlsProps) => {
  const isFirst = moduleIndex === 0;
  const isLast = moduleIndex === totalModules - 1;

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white/50 hover:text-white hover:bg-white/5"
        onClick={() => onMoveUp(moduleIndex)}
        disabled={isFirst}
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
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white/50 hover:text-white hover:bg-white/5"
        onClick={() => onMoveDown(moduleIndex)}
        disabled={isLast}
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
    </>
  );
};

export default ModuleControls; 