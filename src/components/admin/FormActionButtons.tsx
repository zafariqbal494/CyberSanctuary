import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface FormActionButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  saveText?: string;
  cancelText?: string;
}

const FormActionButtons = ({
  onCancel,
  isSubmitting,
  isEditing = false,
  saveText,
  cancelText = "Cancel"
}: FormActionButtonsProps) => {
  const defaultSaveText = isEditing ? 'Update Course' : 'Create Course';
  
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        className="border-white/20 text-white/70 hover:bg-white/5"
        onClick={onCancel}
      >
        {cancelText}
      </Button>
      <Button 
        type="submit" 
        className="bg-neon-green hover:bg-neon-green/90 text-black flex gap-2"
        disabled={isSubmitting}
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? 'Saving...' : saveText || defaultSaveText}
      </Button>
    </div>
  );
};

export default FormActionButtons; 