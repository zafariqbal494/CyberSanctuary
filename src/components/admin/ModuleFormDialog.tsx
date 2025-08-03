import { Module } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ModuleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  module: Module | null;
  moduleTitle: string;
  moduleDescription: string;
  moduleDuration: number;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDurationChange: (value: number) => void;
}

const ModuleFormDialog = ({
  isOpen,
  onClose,
  onSave,
  module,
  moduleTitle,
  moduleDescription,
  moduleDuration,
  onTitleChange,
  onDescriptionChange,
  onDurationChange
}: ModuleFormDialogProps) => {
  const isEditing = !!module;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono text-white">
            {isEditing ? 'Edit Module' : 'Add Module'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="moduleTitle" className="text-white/80 font-mono">
              Module Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="moduleTitle"
              value={moduleTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Introduction to Penetration Testing"
              className="bg-cyber-light border-neon-green/30 text-white mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="moduleDescription" className="text-white/80 font-mono">
              Module Description
            </Label>
            <Textarea
              id="moduleDescription"
              value={moduleDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Brief description of the module content"
              className="bg-cyber-light border-neon-green/30 text-white mt-1 h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="moduleDuration" className="text-white/80 font-mono">
              Estimated Duration (minutes)
            </Label>
            <Input
              id="moduleDuration"
              type="number"
              min="0"
              value={moduleDuration}
              onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
              placeholder="e.g. 120"
              className="bg-cyber-light border-neon-green/30 text-white mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              className="border-white/20 text-white/70 hover:bg-white/5"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              onClick={onSave}
            >
              {isEditing ? 'Update Module' : 'Add Module'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleFormDialog; 