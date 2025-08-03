import { Lesson } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LessonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  lesson: Lesson | null;
  lessonTitle: string;
  lessonDuration: number;
  lessonType: string;
  onTitleChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onTypeChange: (value: string) => void;
}

const LessonFormDialog = ({
  isOpen,
  onClose,
  onSave,
  lesson,
  lessonTitle,
  lessonDuration,
  lessonType,
  onTitleChange,
  onDurationChange,
  onTypeChange
}: LessonFormDialogProps) => {
  const isEditing = !!lesson;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono text-white">
            {isEditing ? 'Edit Lesson' : 'Add Lesson'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="lessonTitle" className="text-white/80 font-mono">
              Lesson Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lessonTitle"
              value={lessonTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Network Scanning Techniques"
              className="bg-cyber-light border-neon-green/30 text-white mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lessonDuration" className="text-white/80 font-mono">
              Duration (minutes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lessonDuration"
              type="number"
              min="0"
              value={lessonDuration}
              onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
              placeholder="e.g. 30"
              className="bg-cyber-light border-neon-green/30 text-white mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lessonType" className="text-white/80 font-mono">
              Lesson Type
            </Label>
            <Select 
              value={lessonType} 
              onValueChange={onTypeChange}
            >
              <SelectTrigger id="lessonType" className="bg-cyber-light border-neon-green/30 text-white mt-1">
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-dark border-neon-green/30 text-white">
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
              </SelectContent>
            </Select>
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
              {isEditing ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonFormDialog; 