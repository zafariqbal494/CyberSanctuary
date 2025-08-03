import { Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SaveStatus } from '@/hooks/useCourseEditor';

interface CourseModuleSaveControlsProps {
  saveStatus: SaveStatus;
  onSave: () => void;
}

const CourseModuleSaveControls = ({ saveStatus, onSave }: CourseModuleSaveControlsProps) => {
  return (
    <div className="flex justify-end mt-6 border-t border-white/10 pt-4">
      <Button
        className="bg-neon-green hover:bg-neon-green/90 text-black"
        disabled={saveStatus === 'saving'}
        onClick={onSave}
      >
        {saveStatus === 'saving' ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Curriculum...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === 'saved' ? 'Saved' : 'Save Curriculum'}
          </>
        )}
      </Button>
    </div>
  );
};

export default CourseModuleSaveControls; 